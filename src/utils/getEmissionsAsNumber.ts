export function getEmissionsNumericValue(emissioni: string | number | undefined): string {
  if (!emissioni) return "";

  // Convert to string if it's a number
  const emissioniStr = typeof emissioni === 'string' ? emissioni : String(emissioni);

  // Remove "g/km" suffix if present
  return emissioniStr.replace(/g\/km$/i, "").trim();
}