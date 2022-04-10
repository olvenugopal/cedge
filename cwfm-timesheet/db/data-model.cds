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
entity TimesheetStatuses : sap.common.CodeList {
    key code : String(4) enum {
            created         = 'CREA';
            updated         = 'UPDT';
            error           = 'EROR';
            pendingApproval = 'PEND';
            inProcess       = 'INPR';
            approved        = 'APPR';
            rejected        = 'REJE';
        };
}

@cds.odata.valuelist
entity TimesheetStatusReasons : sap.common.CodeList {
    key code : String(4) enum {
            invalidPartner  = 'BP01';
            partnerArchived = 'BP02';
            bpStatusInvalid = 'BP03';
        };
}

//
// Timesheet Datamodel
//
entity Timesheets : managed {
    key ID                  : UUID;
        recordNumber        : String(10);
        partnerID           : String;
        workDate            : Date;
        workDuration        : Time;
        projectReference    : String(50);
        matchScore          : Decimal;
        status              : Association to one TimesheetStatuses;
        statusReason        : Association to one TimesheetStatusReasons;
        virtual criticality : Integer; //  1: Red, 2: Yellow, 3: Green, 0: Unknown;
}
