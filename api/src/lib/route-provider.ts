import type { RouteResult } from "../../../shared/types/index";
import { searchPubTransPathT } from "./odsay";

export type Coord = {
  lat: number;
  lng: number;
};

export type RouteSearchInput = Coord & {
  stationId?: string;
};

export interface RouteProvider {
  search(from: RouteSearchInput, to: RouteSearchInput): Promise<RouteResult[]>;
}

export class ODsayRouteProvider implements RouteProvider {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  search(from: RouteSearchInput, to: RouteSearchInput): Promise<RouteResult[]> {
    return searchPubTransPathT(this.apiKey, from, to);
  }
}
