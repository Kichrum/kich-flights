export interface FlightSlice {
  arrival_date_time_utc: string;
  departure_date_time_utc: string;
  destination_name: string;
  duration: number;
  flight_number: string;
  origin_name: string;
}

export interface Flight {
  slices: FlightSlice[];
  price: number;
}

export interface FlightsApiResponse {
  flights: Flight[];
}
