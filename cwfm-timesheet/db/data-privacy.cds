using {cwfm} from '../db/data-model';

annotate cwfm.Timesheets with @PersonalData   : {
    DataSubjectRole : 'Vendor',
    EntitySemantics : 'DataSubjectDetails'
}{
    partnerID    @PersonalData.FieldSemantics : 'DataSubjectID';
    workDate     @PersonalData.IsPotentiallyPersonal;
    workDuration @PersonalData.IsPotentiallyPersonal;
}

annotate cwfm.Timesheets with @AuditLog.Operation : {
    Read   : false,
    Insert : false,
    Update : true,
    Delete : true
};
