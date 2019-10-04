import { string } from "prop-types";

type ParkStatus = 'DRAFT' | 'PENDING' | 'UPDATED';

type JinmaUserRole = {
  name: string;
  authorities: string[];
  id: number;
};

type JinmaUser = {
  username: string;
  realname: string;
  phone: string;
  email: string;
  roles?: JinmaUserRole[];
  enabled: boolean;
  administrator: boolean;
  id: number;
};

// __     __             _
// \ \   / /__ _ __   __| | ___  _ __
//  \ \ / / _ \ '_ \ / _` |/ _ \| '__|
//   \ V /  __/ | | | (_| | (_) | |
//    \_/ \___|_| |_|\__,_|\___/|_|
//

type JinmaVendor = {
  name: string;
  deviceLimit: number;
  expireDate: string;
  state: string;
  updateTime: string;
  server: JinmaVendorServerInfo;
  details: JinmaVendorDetails;
  enabled: boolean;
  id: number;
};

type JinmaVendorServerInfo = {
  hubUrl: string;
  apiUrl: string;
  webUrl: string;
};

type JinmaVendorDetails = {
  contact: JinmaVendorContact;
  address: JinmaVendorAddress;
  licenseUrl: string;
  logoUrl: string;
  description: string;
};

type JinmaVendorContact = {
  name: string;
  phone: string;
  email: string;
};

type JinmaVendorAddress = {
  longitude: number;
  latitude: number;
  address: string;
  govCode: number;
};

//  ____            _
// |  _ \ __ _ _ __| | __
// | |_) / _` | '__| |/ /
// |  __/ (_| | |  |   <
// |_|   \__,_|_|  |_|\_\
//

type JinmaPark = {
  name: string;
  deviceLimit: number;
  expireDate: string;
  state: string;
  updateTime: string;
  server: JinmaParkServerInfo;
  details: JinmaParkDetails;
  enabled: boolean;
  id: number;
};

type JinmaParkServerInfo = {
  hubUrl: string;
  apiUrl: string;
  webUrl: string;
};

type JinmaParkDetails = {
  contact: JinmaParkContact;
  address: JinmaParkAddress;
  licenseUrl: string;
  logoUrl: string;
  description: string;
};

type JinmaParkContact = {
  name: string;
  phone: string;
  email: string;
};

type JinmaParkAddress = {
  longitude: number;
  latitude: number;
  address: string;
  govCode: number;
};

//  ____             _
// |  _ \  _____   _(_) ___ ___
// | | | |/ _ \ \ / / |/ __/ _ \
// | |_| |  __/\ V /| | (_|  __/
// |____/ \___| \_/ |_|\___\___|
//

type JinmaDevice = {
  contact: JinmaDeviceContact;
  expireDate: string;
  updateTime: string;
  park: JinmaPark;
  vendor: JinmaVendor;
  enabled: boolean;
  // plcModel: string;
  uuid: string;
  id: number;
};

type JinmaDeviceContact = {
  name: string;
  phone: string;
  email: string;
};

type JinmaDeviceLog = {
  device: JinmaDevice;
  remoteHost: string;
  createTime: string;
  permitted: boolean;
  message: string;
  id: number;
};

type JinmaSupervise = {
  name: string;
  contact: JinmaSuperviseContact;
  server: JinmaSuperviseServerInfo;
  description: string;
  id: number;
};

type JinmaSuperviseContact = {
  name: string;
  phone: string;
  email: string;
};

type JinmaSuperviseServerInfo = {
  hubUrl: string;
  apiUrl: string;
  webUrl: string;
};


type JinmaDeviceConfigForVendorPlatform = {
  device: {
    name?: string;
    park?: any;
    enabled?: boolean;
    updateTime?: string;
    uuid?: string;
  };
  backgroundUrl: string;
  plcModel: string;
  connectionString?: string;
  period: string;
  metrics: JinmaDeviceConfig_MetricMap;
  lockAddress?: null;
  uuid: string;
};
type JinmaDeviceConfig_Metric = {
  id?: string;
  address: string;
  displayType: string;
  description: string;
  location: { x: number; y: number };
  private: boolean;

  extraType?: {
    boolOrNum: string;
    color: string;
    size: string;
  };
};
type JinmaDeviceConfig_MetricMap = {
  [id: string]: JinmaDeviceConfig_Metric;
};


//  ____    _              __    __
// / ___|  | |_    __ _   / _|  / _|
// \___ \  | __|  / _` | | |_  | |_
//  ___) | | |_  | (_| | |  _| |  _|
// |____/   \__|  \__,_| |_|   |_|

type JinmaStaff = {
  realname: string;
  externalId: string;
  username: string;
  phone:string;
  email:string;
  updateTime: string;
  personalInfo: JinmaStaffPersonalInfo;
  roles:string;
  enabled:boolean;
  administrator:boolean;
  id:number;
};

type JinmaStaffCertificate = {
  attachments: Array;
  validBefore:string;
  updateTime:string;
  job:string;
  staff:JinmaStaff;
  id:JinmaStaffCertificateId;
};

type JinmaStaffCertificateId = {
  externalId:string;
  type:string;
}

type JinmaStaffPersonalInfo = {
  avatarUrl:string;
  political : string;
  maritalStatus : string;
  nationality : string;
  birthplace : string;
  address:  string;
  birthday :  string;
  gender:   string;
  identify :  string;
};
