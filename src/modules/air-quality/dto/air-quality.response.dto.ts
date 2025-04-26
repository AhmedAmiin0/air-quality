
import { PollutionDto } from '@/shared/dtos/pollution.dto';
import { Expose, plainToInstance, Transform, Type } from 'class-transformer';

class ResultDto {
    @Expose({ name: 'Pollution' })
    @Transform(({ obj }) => {
        console.log("Pollution", obj);
        return plainToInstance(PollutionDto, obj, { excludeExtraneousValues: true });
    })
    public Pollution: PollutionDto;
}

export class AirQualityResponseDto {
    @Expose({ name: 'Result' })
    @Transform(({ obj }) => plainToInstance(ResultDto, obj, { excludeExtraneousValues: true }))
    @Type(() => ResultDto)
    public Result: ResultDto;
}
