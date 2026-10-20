import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTriage, URGENCY_SIGNS } from './triageRules';

test('URGENCY_SIGNS contains 22 clinical signs compliant with project specs', () => {
  assert.equal(URGENCY_SIGNS.length, 22);

  const solidSigns = URGENCY_SIGNS.filter(s => s.category === 'sólido');
  const thresholdSigns = URGENCY_SIGNS.filter(s => s.category === 'umbral_por_contrastar');
  const conflictSigns = URGENCY_SIGNS.filter(s => s.category === 'en_conflicto');
  const noSourceSigns = URGENCY_SIGNS.filter(s => s.category === 'sin_fuente');

  assert.equal(solidSigns.length, 12, 'Must have exactly 12 solid signs (OE1)');
  assert.equal(thresholdSigns.length, 8, 'Must have 8 threshold signs');
  assert.equal(conflictSigns.length, 1, 'Must have 1 conflict sign (vómito con sangre)');
  assert.equal(noSourceSigns.length, 1, 'Must have 1 sign without source (diarrea aislada)');
});

test('Immediate triage for severe respiratory distress should be ALTO', () => {
  const result = evaluateTriage({
    species: 'Canino',
    chiefComplaint: 'Perro con respiración agitada y lengua morada',
    selectedSignIds: ['s-01'], // DIF_RESP_SEV
  });

  assert.equal(result.level, 'Alto');
  assert.equal(result.recommendedWaitTime, 'Inmediata (< 15 minutos)');
  assert.ok(result.immediateRecommendations.length > 0);
});

test('Precautionary escalation: "Ante la duda, subir de nivel" lifts Bajo to Moderado', () => {
  const result = evaluateTriage({
    species: 'Canino',
    chiefComplaint: 'Diarrea aislada pero el tutor nota al animal dudoso',
    selectedSignIds: ['s-22'], // DIARREA_AISLADA (Bajo default)
    isDoubtful: true,
  });

  assert.equal(result.level, 'Moderado');
  assert.equal(result.isEscalatedByPrecaution, true);
  assert.ok(result.rulesApplied.some(r => r.includes('Ante la duda, subir de nivel')));
});

test('Conflict sign vómito con sangre (Hematemesis) is classified as ALTO by precautionary principle', () => {
  const result = evaluateTriage({
    species: 'Felino',
    chiefComplaint: 'Vómito con estrías de sangre',
    selectedSignIds: ['s-21'], // Hematemesis
  });

  assert.equal(result.level, 'Alto');
  assert.ok(result.rulesApplied.some(r => r.includes('conflicto clínico')));
});

test('Feline urinary difficulty is escalated to ALTO due to urethral obstruction fatality risk', () => {
  const result = evaluateTriage({
    species: 'Felino',
    chiefComplaint: 'Gato maullando en arenero sin poder orinar',
    selectedSignIds: ['s-20'], // DISURIA_HEMATURIA (Moderado default)
  });

  assert.equal(result.level, 'Alto');
  assert.equal(result.isEscalatedByPrecaution, true);
});
