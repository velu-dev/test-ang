export const api_endpoint = {
    //authentication
    signIn: 'auth/signin',
    signUp: 'auth/signup',
    signupVerify: 'auth/signup-verify',
    resetPassword: 'admin/reset-admin-password',
    emailVerify: 'auth/email-verify',
    userCsvUpload: 'admin/csv-upload',
    getAdminUser: "admin/users",
    getAdminRoles: "admin/roles",
    getUser: "admin/user/",
    createUser: "admin/create",
    updateUser: "admin/update-user/",
    getSubscribersRole: "admin/subscriber-roles",
    getVendorRole: "admin/vendor-roles",
    getSubscribers: "admin/subscribers",
    getvendors: "admin/vendors",
    disable_user: "admin/disable-user/",
    resendPassword: 'admin/resend-temp-password',
    verifySubscriberStatus: 'auth/verify-subscriber-status',
    changeRole: "subscriber/switch-to-examiner/",
    updateSignup: 'auth/update-signup-register',

    //Subscriber
    getSubscriberUsers: 'subscriber/users',
    getSubscriberRole: 'subscriber/roles',
    getSubscriberUser: 'subscriber/user',
    createSubscriberUser: 'subscriber/create',
    subscriberProfileUpdate: 'subscriber/profile-update/',
    subscriberProfile: 'subscriber/profile',
    subscriberDisableUser: "subscriber/disable-user/",

    /// subscriber-staff-manager
    createSubscriberManageUser: 'subscriber-staff-manager/create',
    getSubscriberManageUsers: 'subscriber-staff-manager/users',
    getSubscriberManageRole: 'subscriber-staff-manager/roles',
    subscriberManageDisableUser: "subscriber-staff-manager/disable-user/",

    //Claim Service endpoint
    getClaimantDetails: "claimant/details",
    createClaim: "claim/create",
    updateClaim: "claim/update/",
    createClaimant: "claimant/create",
    updateClaimant: "claimant/update/",
    // callerAffliation: "claims/seed-data/agent_type",
    searchClaimant: "claimant/search",
    getClaims: "claim",
    getClaim: "claim",
    searchEams: "claim/eams-wcab-search/",
    examinar_type: "subscriber/examiner/examiner-list",
    create_billable_item: "billable-item/create",
    update_billable_item: "billable-item/update/",
    get_examinar_address: "subscriber/examiner/service-locations/",
    getBillItem: 'billable-item/details',
    correspondenceUpload: 'claim/claims-correspondence-upload',
    getClaimant: 'claimant/',
    getcorrespondence: 'claim/correspondence-details/',
    deleteCorrespondence: 'claim/correspondence-remove/',
    billableItemList: 'claim/billable-item-list/',
    deuList: 'claim/seed-data/deu_office_details',
    listIntakeCall: "claim/seed-data/intake_contact_type",
    billableItemSingle: 'claim/billable-item/',


    //seed data
    seedData: 'claim/seed-data/',
    bodyParts: "seed-data/body_part",

    //manage-address
    addAddress: 'subscriber/examiner/add-address',
    getAddress: 'subscriber/examiner/get-address',
    updateAddress: 'subscriber/examiner/update-address/',
    deleteAddress: 'subscriber/examiner/remove-address',
    allExaminerAddress: 'subscriber/examiner/all-address',
    addExistAddress: 'subscriber/examiner/add-exist-address',
    updatePrimaryAddress: 'subscriber/update/primary-billing-locations/',
    getPrimaryAddress: 'subscriber/primary-billing-locations',
    updateAgents: 'claim/update-agents/',
    updateInjury: 'claim/update-injuries/',
    deleteInjury: 'claim/injuries-remove/',
    getInjury: "claim/injuries-list/",
    getBillings: "billing/details/",
    getBilling: 'billing/submission/',
    //examiner

    getExaminerList: 'subscriber/examiner/examiner-list',
    getSingleExaminer: 'subscriber/examiner/get-address/',
    searchAddress: 'subscriber/examiner/search-address',

    //examination
    getExamination: 'examinations/details',
    getAllExamination: 'examinations/',
    documentType: 'examinations/document-upload',
    getDocumentData: 'examinations/document-details/',
    deleteDocument: 'examinations/document-remove/'
}