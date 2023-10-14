export const ratelist = [
  {
    modality: "X_RAY",
    investigations: [
      {
        type: "Abdomen",
        rate: 500,
        filmCount: 1,
      },
      {
        type: "ARM AP/LAT",
        rate: 800,
        filmCount: 1,
      },
      //     {
      //       type: "ANKLE AP/LAT",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "CHEST PA VIEW",
      //       rate: 400,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "CERVICAL SPINE AP/LAT",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "ELBOW AP/LAT",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "FOOT AP/OBLIQUE",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "FOREARM AP/LAT",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "HAND AP/LAT",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "IVP",
      //       rate: 3000,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "KNEE AP/LAT",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "KUB",
      //       rate: 600,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "LEG AP/LAT",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "LUMBAR SPINE AP/LAT",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "MANDIBLE",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "RGU",
      //       rate: 3000,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "MCU",
      //       rate: 3000,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "RGU AND MCU",
      //       rate: 5000,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "NECK",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "ORBIT",
      //       rate: 600,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "PELVIS",
      //       rate: 600,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "PELVIS WITH SINGLE HIP",
      //       rate: 600,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "PELVIS WITH BOTH HIP",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "PNS",
      //       rate: 700,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "SKULL",
      //       rate: 700,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "SHOULDER AP/OBLIQUE",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "THIGH AP/LAT",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "THORACIC SPINE AP/LAT",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "METACARPAL/ FINGER AP/OBLIQUE",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "WRIST AP/LATERAL",
      //       rate: 800,
      //       filmCount: 1,
      //     },
      //   ],
      // },
      // {
      //   modality: "CT_SCAN",
      //   investigations: [
      //     {
      //       type: "BRAIN PLAIN",
      //       rate: 2500,
      //       filmCount: 1,
      //     },
      //     {
      //       type: "BRAIN WITH CONTRAST",
      //       rate: 3500,
      //       filmCount: 2,
      //     },
      //     {
      //       type: "CONTRAST CHARGES",
      //       rate: 1000,
      //       filmCount: 0,
      //     },
      //     {
      //       type: "ABDOMEN PLAIN",
      //       rate: 5000,
      //       filmCount: 2,
      //     },
      //     {
      //       type: "ABDOMEN WITH PELVIS CONTRAST",
      //       rate: 7000,
      //       filmCount: 3,
      //     },
      //     {
      //       type: "PNS WITH CONTRAST",
      //       rate: 4500,
      //       filmCount: 4,
      //     },
      //     {
      //       type: "NECK PLAIN",
      //       rate: 3500,
      //       filmCount: 3,
      //     },
      //     {
      //       type: "NECK WITH CONTRAST",
      //       rate: 4500,
      //       filmCount: 4,
      //     },
      //     {
      //       type: "CHEST PLAIN",
      //       rate: 3500,
      //       filmCount: 3,
      //     },
      //     {
      //       type: "CHEST CONTRAST",
      //       rate: 4500,
      //       filmCount: 4,
      //     },
      //     {
      //       type: "TEMPORAL BONE PLAIN",
      //       rate: 5000,
      //       filmCount: 2,
      //     },
      //     {
      //       type: "TEMPORAL BONE WITH CONTRAST",
      //       rate: 6500,
      //       filmCount: 3,
      //     },
      //     {
      //       type: "PELVIS PLAIN",
      //       rate: 4500,
      //       filmCount: 2/3,
      //     },
      //     {
      //       type: "PELVIS WITH CONTRAST",
      //       rate: 5500,
      //       filmCount: 4,
      //     },
      //     {
      //       type: "PELVIS WITH HIP JOINT PLAIN",
      //       rate: 4500,
      //       filmCount: 3,
      //     },
      //     {
      //       type: "UROGRAPHY /KUB PLAIN",
      //       rate: 6000,
      //       filmCount: 2,
      //     },
      //     {
      //       type: "UROGRAPHY /KUB CONTRAST",
      //       rate: 7000,
      //       filmCount: 3,
      //     },
      //     {
      //       type: "FACE WITH 3D RECONSTRUCTION",
      //       rate: 5000,
      //       filmCount: 3,
      //     },
      //     {
      //       type: "ANGIOGRAPHY ANY REGION ",
      //       rate: 12000,
      //       filmCount: 3,
      //     },
      //     {
      //       type: "JOINTS WITH 3D RECONSTRUCTION",
      //       rate: 4500,
      //       filmCount: 3,
      //     },
      //     {
      //       type: "CERVICAL SPINE",
      //       rate: 5000,
      //       filmCount: 2,
      //     },
      //     {
      //       type: "THORACIC/DORSAL SPINE",
      //       rate: 5000,
      //       filmCount: 2,
      //     },
      //     {
      //       type: "LUMBAR SPINE",
      //       rate: 5000,
      //       filmCount: 2,
      //     },
      //     {
      //       type: "EMERGENCY CHARGES (after 9 PM)",
      //       rate: 1000,
      //       filmCount: 0,
      //     },
      //     {
      //       type: "CT GUIDED BIOPSY OF LUNGS MASS",
      //       rate: 8000,
      //       filmCount: 0,
      //     },
      //     {
      //       type: "CT GUIDED BIOPSY OF ABDOMEN MASS",
      //       rate: 8000,
      //       filmCount: 0,
      //     },
      //   ],
      // },
      // {
      //   modality: "USG",
      //   investigations: [
      //     {
      //       type: "ABDOMEN",
      //       rate: 1000,
      //       filmCount: null,
      //     },
      //     {
      //       type: "PELVIS",
      //       rate: 900,
      //       filmCount: null,
      //     },
      //     {
      //       type: "3 D PELVIS",
      //       rate: 2000,
      //       filmCount: null,
      //     },
      //     {
      //       type: "KUB",
      //       rate: 900,
      //       filmCount: null,
      //     },
      //     {
      //       type: "OBSTETRIC ROUTINE",
      //       rate: 1200,
      //       filmCount: null,
      //     },
      //     {
      //       type: "ANOMALY / NT SCAN",
      //       rate: 1700,
      //       filmCount: null,
      //     },
      //     {
      //       type: "NECK / THYROID",
      //       rate: 1200,
      //       filmCount: null,
      //     },
      //     {
      //       type: "BREAST - SINGLE",
      //       rate: 800,
      //       filmCount: null,
      //     },
      //     {
      //       type: "BREAST - BOTH SIDE",
      //       rate: 1200,
      //       filmCount: null,
      //     },
      //     {
      //       type: "LOCAL AREA / SOFT TISSUE",
      //       rate: 900,
      //       filmCount: null,
      //     },
      //     {
      //       type: "SCROTUM",
      //       rate: 1300,
      //       filmCount: null,
      //     },
      //     {
      //       type: "INGUINAL REGION",
      //       rate: 1000,
      //       filmCount: null,
      //     },
      //     {
      //       type: "OVULATION STUDY",
      //       rate: 1000,
      //       filmCount: null,
      //     },
      //     {
      //       type: "4 D USG",
      //       rate: 5500,
      //       filmCount: null,
      //     },
      //     {
      //       type: "FETAL ECHO",
      //       rate: 2000,
      //       filmCount: null,
      //     },
      //     {
      //       type: "JOINT",
      //       rate: 1500,
      //       filmCount: null,
      //     },
      //     {
      //       type: "NEUROSONOGRAM",
      //       rate: 1300,
      //       filmCount: null,
      //     },
      //     {
      //       type: "THORAX",
      //       rate: 1200,
      //       filmCount: null,
      //     },
      //     {
      //       type: "OBSTETRIC DOPPLER",
      //       rate: 1500,
      //       filmCount: null,
      //     },
      //     {
      //       type: "CAROTID DOPPLER",
      //       rate: 1500,
      //       filmCount: null,
      //     },
      //     {
      //       type: "RENAL DOPPLER",
      //       rate: 1800,
      //       filmCount: null,
      //     },
      //     {
      //       type: "SCROTAL DOPPLER",
      //       rate: 1500,
      //       filmCount: null,
      //     },
      //     {
      //       type: "PORTAL DOPPLER",
      //       rate: 1500,
      //       filmCount: null,
      //     },
      //     {
      //       type: "PENILE DOPPLER",
      //       rate: 1500,
      //       filmCount: null,
      //     },
      //     {
      //       type: "ARTERIAL DOPPLER- SINGLE LIMB",
      //       rate: 1500,
      //       filmCount: null,
      //     },
      //     {
      //       type: "ARTERIAL DOPPLER - BOTH LIMBS",
      //       rate: 3000,
      //       filmCount: null,
      //     },
      //     {
      //       type: "VENOUS DOPPLER - SINGLE LIMB",
      //       rate: 1500,
      //       filmCount: null,
      //     },
      //     {
      //       type: "VENOUS DOPPLER - BOTH LIMBS",
      //       rate: 3000,
      //       filmCount: null,
      //     },
      //     {
      //       type: "USG GUIDED FNAC",
      //       rate: 2500,
      //       filmCount: null,
      //     },
      //     {
      //       type: "USG GUIDED BIOPSY",
      //       rate: 6000,
      //       filmCount: null,
      //     },
      //     {
      //       type: "USG GUIDED TAPPING",
      //       rate: 1500,
      //       filmCount: null,
      //     },
      //     {
      //       type: "USG GUIDED PIG TAIL INSERTION",
      //       rate: 10000,
      //       filmCount: null,
      //     },
      //     {
      //       type: "EMERGENCY CHARGES",
      //       rate: 1000,
      //       filmCount: null,
      //     },
    ],
  },
];
