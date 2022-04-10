using {TimesheetService} from '../../srv/timesheet-service';

annotate TimesheetService.Timesheets {
    ID           @Core.Computed;
    recordNumber @Core.Computed;
}
