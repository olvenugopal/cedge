using {TimesheetService} from '../../srv/timesheet-service';

annotate TimesheetService.Timesheets {
    ID           @Core.Computed  @Common.FieldControl : #ReadOnly;
    recordNumber @Core.Computed  @Common.FieldControl : #ReadOnly;
    matchScore   @Core.Computed  @Common.FieldControl : #ReadOnly;
    statusReason @Core.Computed  @Common.FieldControl : #ReadOnly;
    createdAt    @Core.Computed  @Common.FieldControl : #ReadOnly;
    createdBy    @Core.Computed  @Common.FieldControl : #ReadOnly;
    modifiedAt   @Core.Computed  @Common.FieldControl : #ReadOnly;
    modifiedBy   @Core.Computed  @Common.FieldControl : #ReadOnly;
}
