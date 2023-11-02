import { Auth } from "./Auth";
import { Booking } from "./Booking";
import { Centre } from "./Centre";
import { CentreExpense } from "./CentreExpense";
import { CentreRateList } from "./CentreRateList";
import { DoctorCommission } from "./DoctorCommission";
import { UpdateRequest } from "./UpdateRequest";

const auth = new Auth();
const centre = new Centre();
const drcommission = new DoctorCommission();
const booking = new Booking();
const centreexpense = new CentreExpense();
const ratelist = new CentreRateList();
const edit = new UpdateRequest()

export { auth, centre, drcommission, booking, centreexpense, ratelist, edit };
