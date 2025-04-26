import { Injectable } from "@nestjs/common";
import { AirQualityEntity } from "../entities/air-quality.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { from, map, Observable } from "rxjs";

@Injectable()
export class AirQualityRepository {
    constructor(
        @InjectRepository(AirQualityEntity)
        private airQualityRepository: Repository<AirQualityEntity>
    ) { }

    createAirQuality(data: Partial<AirQualityEntity>) {
        const airQuality = this.airQualityRepository.create(data);
        console.log("Air Quality Data Created", airQuality);
        return this.airQualityRepository.save(airQuality);
    }

    getMostPollutedTime(city: string) {
        return this.airQualityRepository.findOneOrFail({
            where: {
                city
            },
            order: { aqius: "DESC" },
        })

    }
}
