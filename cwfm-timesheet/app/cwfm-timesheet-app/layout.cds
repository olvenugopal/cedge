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
    { $Type : 'UI.DataField', Label : 'Record ID',          Value : recordNumber },
    { $Type : 'UI.DataField', Label : 'Partner ID',         Value : partnerID },
    { $Type : 'UI.DataField', Label : 'Work Date',          Value : workDate },
    { $Type : 'UI.DataField', Label : 'Work Duration',      Value : workDuration },
    { $Type : 'UI.DataField', Label : 'Project Reference',  Value : projectReference },
    { $Type : 'UI.DataField', Label : 'Match Score',        Value : matchScore, Criticality : criticality },
    { $Type : 'UI.DataField', Label : 'Created On',         Value : createdAt }
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
        { $Type : 'UI.DataField', Label : 'Created On',         Value : createdAt }
    ],
},

Facets : [
    { $Type : 'UI.ReferenceFacet', ID : 'Group1', Label : 'Timesheet Details', Target : '@UI.FieldGroup#Group1' } 
    ]
};