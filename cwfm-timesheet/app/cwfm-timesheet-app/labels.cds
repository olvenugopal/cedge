using {cwfm.Timesheets} from '../../db/data-model';

annotate cwfm.Timesheets with @title :          'Timesheet' {
    ID               @UI.Hidden  @Common.Text : recordNumber;
    recordNumber     @title          :          'Record ID';
    partnerID        @title          :          'Partner ID';
    workDate         @title          :          'Work Date';
    workDuration     @title          :          'Work Duration';
    projectReference @title          :          'Project';
    matchScore       @title          :          'Match Score';
    status           @title          :          'Status';
    statusReason     @title          :          'Status Reason';
}
