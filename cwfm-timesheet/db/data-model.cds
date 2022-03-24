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
    key RecordKey        : UUID @Core.Computed;
        RecordID         : String(10);
        PartnerID        : String;
        WorkDate         : Date;
        WorkDuration     : Time;
        ProjectReference : String(50);
        Status           : Association to one TimesheetStatus;
        StatusReason     : Association to one TimesheetStatusReason;
}
