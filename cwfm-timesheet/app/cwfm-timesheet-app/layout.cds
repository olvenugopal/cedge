using TimesheetService as service from '../../srv/timesheet-service';

annotate service.Timesheets with @UI : {

Identification : [ { $Type  : 'UI.DataField', Label : 'Record ID', Value : recordNumber } ],

SelectionFields : [ partnerID, workDate, status_code ],

HeaderInfo : {
    TypeName       : 'Timesheet',
    TypeNamePlural : 'Timesheets',
    Title          : { $Type : 'UI.DataField', Value : recordNumber },
    Description    : { $Type : 'UI.DataField', Value : workDate },
},

LineItem : [
    { $Type : 'UI.DataFieldForAction', Action : 'TimesheetService.processTimesheets', Label : 'Process' },    
    { $Type : 'UI.DataField', Label : 'Record ID',          Value : recordNumber },
    { $Type : 'UI.DataField', Label : 'Partner ID',         Value : partnerID },
    { $Type : 'UI.DataField', Label : 'Work Date',          Value : workDate },
    { $Type : 'UI.DataField', Label : 'Work Duration',      Value : workDuration },
    { $Type : 'UI.DataField', Label : 'Project Reference',  Value : projectReference },
    { $Type : 'UI.DataField', Label : 'Match Score',        Value : matchScore, Criticality : criticality },
    { $Type : 'UI.DataField', Label : 'Status',             Value : status_code }
],

FieldGroup#Group1 : {
    $Type : 'UI.FieldGroupType',
    Data  : [
        { $Type : 'UI.DataField', Label : 'Record ID',          Value : recordNumber },
        { $Type : 'UI.DataField', Label : 'Partner ID',         Value : partnerID },
        { $Type : 'UI.DataField', Label : 'Work Date',          Value : workDate },
        { $Type : 'UI.DataField', Label : 'Work Duration',      Value : workDuration },
        { $Type : 'UI.DataField', Label : 'Project Reference',  Value : projectReference },
        { $Type : 'UI.DataField', Label : 'Match Score',        Value : matchScore, Criticality : criticality },
        { $Type : 'UI.DataField', Label : 'Status',             Value : status_code },
        { $Type : 'UI.DataField', Label : 'Status Reason',      Value : statusReason_code },
        { $Type : 'UI.DataField', Label : 'Created On',         Value : createdAt },
        { $Type : 'UI.DataField', Label : 'Created By',         Value : createdBy },
        { $Type : 'UI.DataField', Label : 'Modified On',        Value : modifiedAt },
        { $Type : 'UI.DataField', Label : 'Modified By',        Value : modifiedBy }
    ],
},

Facets : [ { $Type : 'UI.CollectionFacet', Label : 'Timesheet', ID : 'Timesheet',
    Facets : [
      { $Type : 'UI.ReferenceFacet', ID : 'Group1', Label : 'Timesheet Details', Target : '@UI.FieldGroup#Group1' }
    ]
}]

};