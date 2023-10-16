import { PickType } from '@nestjs/swagger';
import {
  DateField,
  NumberField,
  ObjectField,
  StringField,
  UUIDField,
} from 'libs/decorators';
import { RateList } from 'src/database/entities/rate-list.entity';
import { IInvestigation } from 'src/database/interfaces/rate-list.interface';

export class InvestigationDto {
  @StringField()
  type: string;

  @NumberField()
  amount: number;

  @NumberField()
  filmCount: number;

  constructor(investigation?: IInvestigation) {
    if (investigation == null) {
      return;
    }

    this.type = investigation.type;
    this.amount = investigation.amount;
    this.filmCount = investigation.filmCount;
  }
}

export class RateListDto {
  @UUIDField()
  id: string;

  @UUIDField()
  centreId: string;

  @DateField()
  createdAt: Date;

  @DateField()
  updatedAt: Date;

  @StringField()
  modality: string;

  @ObjectField(() => InvestigationDto, { isArray: true })
  investigation: InvestigationDto[];

  constructor(rateList?: RateList) {
    if (rateList == null) {
      return;
    }

    this.id = rateList.id;
    this.createdAt = rateList.createdAt;
    this.updatedAt = rateList.updatedAt;
    this.modality = rateList.modality;
    this.investigation = rateList.investigation.map(
      (investigation) => new InvestigationDto(investigation),
    );
  }
}

export class RateListsDto extends PickType(RateListDto, [
  'modality',
  'investigation',
]) { }

export class CreateRateListDto extends PickType(RateListDto, ['centreId']) {
  @ObjectField(() => RateListsDto, { isArray: true })
  rateLists: RateListsDto[];
}

export class UpdateRateListDto extends PickType(RateListDto, [
  'id',
  'investigation',
]) { }
