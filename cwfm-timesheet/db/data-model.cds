namespace cwfm;

using {
    managed,
    sap,
    sap.common.CodeList as CodeList
} from '@sap/cds/common';

//
// Code Lists
//
@cds.odata.valuelist
entity TimesheetStatus : sap.common.CodeList {
    key code : String(4) enum {
            Created         = 'CREA';
            Error           = 'EROR';
            PendingApproval = 'PEND';
            Processed       = 'PROC';
            Rejected        = 'REJE';
        };
}

@cds.odata.valuelist
entity TimesheetStatusReason : sap.common.CodeList {
    key code : String(4) enum {
            InvalidPartner  = 'BP01';
            PartnerArchived = 'BP02';
            BPStatInvalid   = 'BP03';
        };
}

//
// Timesheet Datamodel
//
entity Timesheet : managed {
    key TimesheetRecordKey    : UUID @Core.Computed;
        TimesheetRecordID     : String(10);
        TimesheetPartnerID    : String;
        TimesheetDate         : Date;
        ProjectReference      : String(50);
        CheckInTime           : Time;
        CheckOutTime          : Time;
        TimesheetStatus       : Association to one TimesheetStatus;
        TimesheetStatusReason : Association to one TimesheetStatusReason;
}
