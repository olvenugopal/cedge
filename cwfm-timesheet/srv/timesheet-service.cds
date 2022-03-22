using {cwfm} from '../db/data-model';

service TimesheetService @(path : '/cwfm') @(requires : 'authenticated-user') {
    entity Timesheet             as projection on cwfm.Timesheet;
    entity TimesheetStatus       as projection on cwfm.TimesheetStatus;
    entity TimesheetStatusReason as projection on cwfm.TimesheetStatusReason;
    action processTimesheets();
}