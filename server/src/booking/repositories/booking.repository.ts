import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { Booking } from 'src/database/entities/booking.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';

@DatabaseRepository(Booking)
export class BookingRepository extends AbstractRepository<Booking> {}
