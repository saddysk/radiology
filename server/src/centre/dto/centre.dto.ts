import { PickType } from '@nestjs/swagger';
import {
  DateField,
  EmailField,
  EmailFieldOptional,
  NumberField,
  ObjectField,
  ObjectFieldOptional,
  PhoneField,
  PhoneFieldOptional,
  StringField,
  StringFieldOptional,
  UUIDField,
} from 'libs/decorators';
import { IAddress } from 'src/database/interfaces/address.interface';

export class AddressDto {
  @StringField()
  line1: string;

  @StringFieldOptional()
  line2?: string;

  @StringField()
  city: string;

  @NumberField()
  postalCode: number;

  @StringField()
  state: string;

  @StringFieldOptional()
  country?: string;

  constructor(address?: IAddress) {
    if (address == null) {
      return;
    }

    this.line1 = address.line1;
    this.line2 = address.line2;
    this.city = address.city;
    this.postalCode = address.postalCode;
    this.state = address.state;
    this.country = address.country;
  }
}

export class CentreDto {
  @UUIDField()
  id: string;

  @StringField()
  centreNumber: string;

  @DateField()
  createdAt: Date;

  @StringField()
  name: string;

  @EmailField()
  email: string;

  @PhoneField()
  phone: string;

  @ObjectField(() => AddressDto)
  address: AddressDto;

  constructor(centre?) {
    if (centre == null) {
      return;
    }

    this.id = centre.id;
    this.centreNumber = centre.centreNumber;
    this.createdAt = centre.createdAt;
    this.name = centre.name;
    this.email = centre.email;
    this.phone = centre.phone;
    this.address = centre.address;
  }
}

export class CreateCentreDto extends PickType(CentreDto, [
  'name',
  'email',
  'phone',
  'address',
]) {}

export class UpdateCentreDto extends PickType(CentreDto, ['id']) {
  @StringFieldOptional()
  name?: string;

  @EmailFieldOptional()
  email?: string;

  @PhoneFieldOptional()
  phone?: string;

  @ObjectFieldOptional(() => AddressDto)
  address?: AddressDto;
}
