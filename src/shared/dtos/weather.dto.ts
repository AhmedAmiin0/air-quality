import { Expose, Transform } from 'class-transformer';

export class WeatherDto {
    @Expose({ name: 'ts' })
    public timestamp: string;

    @Expose({ name: 'tp' })
    public temperatureCelsius: number;

    @Expose({ name: 'pr' })
    public pressureHpa: number;

    @Expose({ name: 'hu' })
    public humidityPercentage: number;

    @Expose({ name: 'ws' })
    public windSpeedKmh: number;

    @Expose({ name: 'wd' })
    public windDirectionDegrees: number;

    @Expose({ name: 'ic' })
    public iconCode: string;

}