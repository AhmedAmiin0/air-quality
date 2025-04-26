import { Expose, Transform } from "class-transformer";

export class PollutionPeakDto {
  @Expose()
  id: string; 

  @Expose()
  aqius: number;

  @Expose()
  @Transform(({ obj }) => {
    const date = new Date(obj.createdAt);
    return date.toLocaleDateString();
  })
  date: string;

  @Expose()
  @Transform(({ obj }) => {
    const date = new Date(obj.createdAt);
    return date.toLocaleTimeString();
  })
  time: string;
}

