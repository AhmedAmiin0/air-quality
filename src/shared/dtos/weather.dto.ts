import { Expose, Transform } from 'class-transformer';

export class WeatherDto {
    @Expose({ name: 'ts' })
    public ts: string;

    @Expose({ name: 'tp' })
    public tp: number;

    @Expose({ name: 'pr' })
    public pr: number;

    @Expose({ name: 'hu' })
    public hu: number;

    @Expose({ name: 'ws' })
    public ws: number;

    @Expose({ name: 'wd' })
    public wd: number;

    @Expose({ name: 'ic' })
    public ic: string;

}