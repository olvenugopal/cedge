using TimesheetService as service from '../../srv/timesheet-service';

annotate service.Timesheet with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'RecordID',
            Value : RecordID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'PartnerID',
            Value : PartnerID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'WorkDate',
            Value : WorkDate,
        },
        {
            $Type : 'UI.DataField',
            Label : 'WorkDuration',
            Value : WorkDuration,
        },
        {
            $Type : 'UI.DataField',
            Label : 'ProjectReference',
            Value : ProjectReference,
        },
    ]
);
annotate service.Timesheet with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'RecordID',
                Value : RecordID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'PartnerID',
                Value : PartnerID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'WorkDate',
                Value : WorkDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'WorkDuration',
                Value : WorkDuration,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProjectReference',
                Value : ProjectReference,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Status_code',
                Value : Status_code,
            },
            {
                $Type : 'UI.DataField',
                Label : 'StatusReason_code',
                Value : StatusReason_code,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        },
    ]
);
