import { IsDecimal, IsNotEmpty } from "class-validator";

export class GetAirQualityDto {
  @IsNotEmpty()
  @IsDecimal()
  lat: number;

  @IsNotEmpty()
  @IsDecimal()
  lon: number;
}
