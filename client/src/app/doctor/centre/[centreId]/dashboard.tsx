import { FC } from "react";

interface DoctorCentreProps {
  centreId: string;
}

const DoctorCentre: FC<DoctorCentreProps> = ({ centreId }) => {
  return <>{centreId}</>;
};

export default DoctorCentre;
