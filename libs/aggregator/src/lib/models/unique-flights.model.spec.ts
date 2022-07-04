import { MOCK_FLIGHTS, MOCK_FLIGHTS_2 } from '../mocks/flights.mocks';
import { UniqueFlights } from './unique-flights.model';

describe('UniqueFlights', () => {
  it('should concat empty flights lists', () => {
    expect(new UniqueFlights([[], []]).data).toEqual([]);
  });

  it('should concat flights lists', () => {
    expect(new UniqueFlights([MOCK_FLIGHTS, MOCK_FLIGHTS_2]).data).toEqual(
      MOCK_FLIGHTS.concat(MOCK_FLIGHTS_2)
    );
  });

  it('should concat flights lists with duplicates', () => {
    expect(
      new UniqueFlights([MOCK_FLIGHTS, MOCK_FLIGHTS_2, MOCK_FLIGHTS]).data
    ).toEqual(MOCK_FLIGHTS.concat(MOCK_FLIGHTS_2));
  });

  it('should remove duplicates only if flight numbers are the same', () => {
    const newMock = {
      ...MOCK_FLIGHTS[0],
      slices: [
        MOCK_FLIGHTS[0].slices[0],
        {
          ...MOCK_FLIGHTS[0].slices[1],
          flight_number: '1',
        },
      ],
    };
    expect(new UniqueFlights([[...MOCK_FLIGHTS, newMock]]).data.length).toBe(3);
  });

  it('should remove duplicates regardless of price', () => {
    const newMock = {
      ...MOCK_FLIGHTS[0],
      price: 0,
    };
    expect(new UniqueFlights([[...MOCK_FLIGHTS, newMock]]).data.length).toBe(2);
  });

  it('should remove duplicates with higher price, longer duration and connection', () => {
    // TODO: Out of scope of this project, probably will be implemented in future.
  });
});
