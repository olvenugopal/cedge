using {TimesheetService} from '../../srv/timesheet-service';

annotate TimesheetService.Timesheets with @odata.draft.enabled;
annotate TimesheetService.Timesheets with @Common.SemanticKey : [recordNumber];
