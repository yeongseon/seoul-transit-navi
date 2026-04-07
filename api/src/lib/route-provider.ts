import type { RouteResult } from "../../../shared/types/index";
import { searchPubTransPathT } from "./odsay";

type Coord = {
  lat: number;
  lng: number;
};

export interface RouteProvider {
  search(from: Coord, to: Coord): Promise<RouteResult[]>;
}

export class ODsayRouteProvider implements RouteProvider {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  search(from: Coord, to: Coord): Promise<RouteResult[]> {
    return searchPubTransPathT(this.apiKey, from, to);
  }
}
