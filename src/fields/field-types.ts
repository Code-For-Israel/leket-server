import { Point, Polygon } from 'geojson';

export interface FieldIdsIntersectionsPrisma {
  field_id: number;
}

export interface FilterNdviRange {
  ndviFrom: number;
  ndviTo: number;
}

export interface FilterAttractivenessRange {
  attractivenessFrom: number;
  attractivenessTo: number;
}

export interface FilterDateRange {
  dateFrom: Date;
  dateTo: Date;
}

export interface FieldGeometry {
  point: Point;
  polygon: Polygon;
}
