  export function getEmissionsNumericValue(emissioni: string | undefined): string {
    if (!emissioni) return "";
    // Remove "g/km" suffix if present
    return emissioni.replace(/g\/km$/i, "").trim();
  };