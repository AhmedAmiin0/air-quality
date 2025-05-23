import { Expose, Transform } from 'class-transformer';

export class PollutionDto {
    @Expose({
        name: "aqius"
    })
    public aqius: number;

    @Expose({ name: "mainus" })
    public mainus: string;

    @Expose({ name: "aqicn" })
    public aqicn: number;

    @Expose({ name: "maincn" })
    public maincn: string;

    @Expose({ name: "ts" })
    public ts: string;
}