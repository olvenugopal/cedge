using { TimesheetService } from '../srv/timesheet-service';

@odata.draft.enabled
annotate TimesheetService.Timesheet with @(
	UI: {
		SelectionFields: [ WorkDate, PartnerID, Status_code ],
		LineItem: [
			{Value: PartnerID, Label:'Partner'},
			{Value: WorkDate, Label:'Work Date'},
			{Value: WorkDuration, Label:'Work Duration'},
            {Value: Status.code, Label:'Status'},
            {Value: ProjectReference, Label:'Project'},
		],
		HeaderInfo: {
			TypeName: 'Timesheet', TypeNamePlural: 'Timesheets',
			Title: {
				Label: 'RecordID ', //A label is possible but it is not considered on the ObjectPage yet
				Value: RecordID
			},
			Description: {Value: Status.descr}
		},
		Identification: [ //Is the main field group
			{Value: createdBy, Label:'Customer'},
			{Value: createdAt, Label:'Date'},
			{Value: RecordID },
		],
		HeaderFacets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>WorkDate}', Target: '@UI.FieldGroup#Work'}
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Details}', Target: '@UI.FieldGroup#Details'},
		],
		FieldGroup#Details: {
			Data: [
                {Value: PartnerID, Label:'Partner'},
                {Value: WorkDate, Label:'Work Date'},
                {Value: WorkDuration, Label:'Work Duration'},
                {Value: ProjectReference, Label:'Project'},
                {Value: Status.code, Label:'Status'},
				{Value: Status.descr, Label:'Status Description'},
                {Value: StatusReason.code, Label:'Status Reason'},
                {Value: StatusReason.descr, Label:'Status Reason Description'}
			]
		},
		FieldGroup#Work: {
			Data: [
				{Value: WorkDate},
				{Value: WorkDuration},
			]
		},
	},
) {
	createdAt @UI.HiddenFilter:false;
	createdBy @UI.HiddenFilter:false;
};