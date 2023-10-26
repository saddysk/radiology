import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { Payment } from 'src/database/entities/payment.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';
import { CreatePaymentDto } from '../dto/payment.dto';

@DatabaseRepository(Payment)
export class PaymentRepository extends AbstractRepository<Payment> {
  async savePayment(
    bookingId: string,
    data: CreatePaymentDto,
  ): Promise<Payment> {
    const payment = new Payment();
    payment.amount = data.amount;
    payment.bookingId = bookingId;
    payment.paymentType = data.paymentType;
    payment.extraCharge = data.extraCharge;
    payment.discount = data.discount;

    await this.save(payment, { reload: true });

    return payment;
  }
}
