import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Flight, FlightsApiResponse } from '../../models/flight.model';

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  fetchFlightsFromSource(url: string): Observable<Flight[]> {
    return this.httpService
      .get<FlightsApiResponse>(url)
      .pipe(map((response) => response.data.flights));
  }
}
