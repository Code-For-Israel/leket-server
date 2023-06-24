export interface Statistics {
  SCL?: Scl;
  NDVI?: NDVI;
}

export interface NDVI {
  max?: number;
  min?: number;
  std?: number;
  mean?: number;
  median?: number;
}

export interface Scl {
  Vegetation?: number;
  'Thin cirrus'?: number;
  'Total pixels'?: number;
  Unclassified?: number;
  'Not-vegetated'?: number;
}
