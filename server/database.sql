CREATE TABLE usersDjezzy
(
    id character varying(100) NOT NULL,
    firstname character varying(200) NOT NULL,
    lastname character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    password text NOT NULL,
    CONSTRAINT "usersDjezzy_pkey" PRIMARY KEY (id),
    CONSTRAINT "usersDjezzy_email_key" UNIQUE (email),
    CONSTRAINT "usersDjezzy_id_key" UNIQUE (id)
);

CREATE TABLE churntrend
(
    churn_date date NOT NULL,
    churnernumber integer NOT NULL,
    CONSTRAINT pk_churn_date PRIMARY KEY (churn_date)
);



CREATE TABLE clientchurndataset(
    id_client INTEGER PRIMARY KEY NOT NULL,
    Tenure INTEGER NOT NULL,
    Seg_Tenure integer NOT NULL,
    Pasivity_G integer NOT NULL, 
    Value_Segment integer NOT NULL,
    Tariff_Profile integer NOT NULL,
    CNT_OUT_VOICE_ONNET_M6 integer NOT NULL,
    CNT_OUT_VOICE_ONNET_M5 integer NOT NULL,
    CNT_OUT_VOICE_OFFNET_M6 integer NOT NULL,
    CNT_OUT_VOICE_OFFNET_M5 integer NOT NULL,
    REV_OUT_VOICE_OFFNET_W4 integer NOT NULL,
    TRAF_OUT_VOICE_OFFNET_W4 integer NOT NULL,
    CNT_OUT_VOICE_ROAMING_W4  integer NOT NULL,
    REV_DATA_PAG_W4 integer NOT NULL,
    REV_REFILL_M5 integer NOT NULL,
    CNT_REFILL_M6 integer NOT NULL,
    CNT_REFILL_M5 integer NOT NULL,
    CNT_REFILL_W4 integer NOT NULL,
    REV_REFILL_W4 integer NOT NULL,
    FLAG_Inactive_3Days integer NOT NULL,
    Count_Inactive_3Days integer NOT NULL,
    Count_Inactive_4Days integer NOT NULL,
    Count_Inactive_5Days integer NOT NULL,
    Count_Inactive_10Days_and_more integer NOT NULL,
    CONSUMER_TYPE_M5 integer NOT NULL,
    CONSUMER_TYPE_M6 integer NOT NULL,
    TRAF_IN_VOICE_ONNET_M5 integer NOT NULL,
    CNT_IN_VOICE_INTERNATIONAL_M5 integer NOT NULL,
    CNT_IN_SMS_ONNET_M4 integer NOT NULL,
    TRAF_IN_VOICE_INTERNATIONAL_W4 integer NOT NULL,
    CNT_IN_SMS_OFFNET_W4 integer NOT NULL,
    SLOPE_SD_VI_ONNET_DUR integer NOT NULL,
    DEGREES_SD_VI_ONNET_DUR integer NOT NULL,
    SLOPE_VI_OFFNET_DUR integer NOT NULL,
    SLOPE_D__FREE_VOL integer NOT NULL,
    Rev_Month_Before_Current_Month numeric NOT NULL,
    TRAF_OUT_VOICE_ONNET_M6 numeric NOT NULL,
    TRAF_OUT_VOICE_ONNET_M4 numeric NOT NULL,
    TRAF_OUT_VOICE_ONNET_M3 numeric NOT NULL,
    REV_BUNDLE_M6 numeric NOT NULL,
    TRAF_OUT_VOICE_ONNET_W4 numeric NOT NULL,
    CNT_OUT_VOICE_ONNET_W4 numeric NOT NULL,
    SLOPE_V_ONNET_DUR numeric NOT NULL,
    SLOPE_SD_VI_OFFNET_DUR numeric NOT NULL,
    flag integer NOT NULL,

    CONSTRAINT fk_client_seg_tenure FOREIGN KEY (Seg_Tenure) REFERENCES Segment_Tenure(id_tenure),
    CONSTRAINT fk_client_Sous_Segment FOREIGN KEY (Value_Segment) REFERENCES Sous_Segment(Id_Segment),
    CONSTRAINT fk_client_Tariff_Profile FOREIGN KEY (Tariff_Profile) REFERENCES Profiles(id_Profile)
);

CREATE TABLE Segment_Tenure (
    id_tenure INTEGER PRIMARY KEY NOT NULL,
    Seg_Tenure character varying(100) NOT NULL
);

CREATE TABLE Sous_Segment (
    Id_Segment INTEGER PRIMARY KEY NOT NULL,
    Value_Segment character varying(100) NOT NULL
);

CREATE TABLE Profiles (
    id_Profile INTEGER PRIMARY KEY NOT NULL,
    Tariff_Profile character varying(100) NOT NULL
);



INSERT INTO Segment_Tenure VALUES (0, 'B 4 Mois - 5 Mois' );
INSERT INTO Segment_Tenure VALUES (1, 'C 5 Mois - 6 Mois' );
INSERT INTO Segment_Tenure VALUES (2, 'D 6 Mois - 7 Mois');
INSERT INTO Segment_Tenure VALUES (3, 'E 7 Mois - 8 Mois' );
INSERT INTO Segment_Tenure VALUES (4, 'F Sup - 8 Mois' );

INSERT INTO Sous_Segment VALUES (0, 'D - LV');
INSERT INTO Sous_Segment VALUES (1, 'E - VLV');
INSERT INTO Sous_Segment VALUES (2, 'F - ZERO');



INSERT INTO Profiles VALUES (0 , 'Allo');
INSERT INTO Profiles VALUES (1 , 'B2C H''BAL');
INSERT INTO Profiles VALUES (2 , 'B2C Pack 3AYLA');
INSERT INTO Profiles VALUES (3 , 'Bayna');
INSERT INTO Profiles VALUES (4  ,'Djezzy Carte');
INSERT INTO Profiles VALUES (5 , 'Djezzy Internet');
INSERT INTO Profiles VALUES (6 , 'Djezzy SPECIAL');
INSERT INTO Profiles VALUES (7 , 'Djezzy ZID');
INSERT INTO Profiles VALUES (8 , 'GO');
INSERT INTO Profiles VALUES (9 , 'Good');
INSERT INTO Profiles VALUES (10 , 'HADRA');
INSERT INTO Profiles VALUES (11 , 'Hayla');
INSERT INTO Profiles VALUES (12 , 'Hayla Bezzef');
INSERT INTO Profiles VALUES (13 , 'Hayla Maxi');
INSERT INTO Profiles VALUES (14 , 'New Hayla Bezzef');
INSERT INTO Profiles VALUES (15 , 'New Hayla Bezzef Hadj');
INSERT INTO Profiles VALUES (16 , 'New Hayla Maxi');
INSERT INTO Profiles VALUES (17 , 'Old Djezzy Carte');
INSERT INTO Profiles VALUES (18 , 'Pack Hayla Bezzef 1200');
INSERT INTO Profiles VALUES (19 , 'Pack Hayla Bezzef 1500');
INSERT INTO Profiles VALUES (20 , 'Play');
INSERT INTO Profiles VALUES (21 , 'iZZY');
