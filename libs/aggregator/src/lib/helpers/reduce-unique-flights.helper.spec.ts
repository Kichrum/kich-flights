import { MOCK_FLIGHTS, MOCK_FLIGHTS_2 } from '../mocks/flights.mocks';
import { reduceUniqueFlights } from './reduce-unique-flights.helper';

describe('reduceUniqueFlights', () => {
  it('should concat empty flights lists', () => {
    expect(reduceUniqueFlights([[], []])).toEqual([]);
  });

  it('should concat flights lists', () => {
    expect(reduceUniqueFlights([MOCK_FLIGHTS, MOCK_FLIGHTS_2])).toEqual(
      MOCK_FLIGHTS.concat(MOCK_FLIGHTS_2)
    );
  });

  it('should concat flights lists with duplicates', () => {
    expect(
      reduceUniqueFlights([MOCK_FLIGHTS, MOCK_FLIGHTS_2, MOCK_FLIGHTS])
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
    expect(reduceUniqueFlights([[...MOCK_FLIGHTS, newMock]]).length).toBe(3);
  });

  it('should remove duplicates regardless of price', () => {
    const newMock = {
      ...MOCK_FLIGHTS[0],
      price: 0,
    };
    expect(reduceUniqueFlights([[...MOCK_FLIGHTS, newMock]]).length).toBe(2);
  });

  it('should remove duplicates with higher price, longer duration', () => {
    // TODO: Business input needed: should be filtered by price or by duration?
  });

  it('should remove duplicates with dependency on increasing/lowering cache', () => {
    // TODO: Business input needed: Check every few minutes if the price in cached response is changed in new response.
  });
});
