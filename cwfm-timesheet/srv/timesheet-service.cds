using {cwfm} from '../db/data-model';

service TimesheetService @(
    path     : '/service',
    requires : 'authenticated-user'
) {
    entity Timesheets             as projection on cwfm.Timesheets actions {
        @(requires : 'Admin')
        action approveTimesheet();
        @(requires : 'Admin')
        action rejectTimesheet();
    };

    entity TimesheetStatuses      as projection on cwfm.TimesheetStatuses;
    entity TimesheetStatusReasons as projection on cwfm.TimesheetStatusReasons;
    action processTimesheets();
    action ExecuteAction();
    action BulkActionByHeader();
}
