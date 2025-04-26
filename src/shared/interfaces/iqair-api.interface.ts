import { PollutionDto } from "../dtos/pollution.dto";
import { WeatherDto } from "../dtos/weather.dto";

export interface IQAirApiResponse {
  status: 'success' | 'fail';
  data: {
    city?: string;
    state?: string;
    country?: string;
    location: {
      type: string;
      coordinates: [number, number][];
    };
    current: {
      pollution: PollutionDto;
      weather: WeatherDto;
    };
  };
}

