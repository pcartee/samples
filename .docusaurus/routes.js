import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/writing-samples/blog/',
    component: ComponentCreator('/writing-samples/blog/', '9b9'),
    exact: true
  },
  {
    path: '/writing-samples/markdown-page/',
    component: ComponentCreator('/writing-samples/markdown-page/', 'b1d'),
    exact: true
  },
  {
    path: '/writing-samples/',
    component: ComponentCreator('/writing-samples/', 'dd6'),
    routes: [
      {
        path: '/writing-samples/',
        component: ComponentCreator('/writing-samples/', '485'),
        routes: [
          {
            path: '/writing-samples/',
            component: ComponentCreator('/writing-samples/', '4a2'),
            routes: [
              {
                path: '/writing-samples/ita/Attestation Technologies/concept-tees-overview/',
                component: ComponentCreator('/writing-samples/ita/Attestation Technologies/concept-tees-overview/', '1d5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Attestation Technologies/GPU confidential computing/concept-gpu-attestation/',
                component: ComponentCreator('/writing-samples/ita/Attestation Technologies/GPU confidential computing/concept-gpu-attestation/', 'ad4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Attestation Technologies/Trusted execution environments/integrate-tdx-adapter-api/',
                component: ComponentCreator('/writing-samples/ita/Attestation Technologies/Trusted execution environments/integrate-tdx-adapter-api/', 'cb1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Attestation Technologies/Trusted execution environments/tee-sev-snp/',
                component: ComponentCreator('/writing-samples/ita/Attestation Technologies/Trusted execution environments/tee-sev-snp/', 'e0e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Attestation Technologies/Trusted execution environments/tee-sgx/',
                component: ComponentCreator('/writing-samples/ita/Attestation Technologies/Trusted execution environments/tee-sgx/', '9b3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Attestation Technologies/Trusted execution environments/tee-tdx/',
                component: ComponentCreator('/writing-samples/ita/Attestation Technologies/Trusted execution environments/tee-tdx/', '886'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Attestation Technologies/Trusted Platform Module/tpm-ak-provision/',
                component: ComponentCreator('/writing-samples/ita/Attestation Technologies/Trusted Platform Module/tpm-ak-provision/', '8b9'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Attestation Technologies/Trusted Platform Module/tpm-ima-logs/',
                component: ComponentCreator('/writing-samples/ita/Attestation Technologies/Trusted Platform Module/tpm-ima-logs/', 'a5f'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Attestation Technologies/Trusted Platform Module/tpm-log/',
                component: ComponentCreator('/writing-samples/ita/Attestation Technologies/Trusted Platform Module/tpm-log/', '9c0'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Attestation Technologies/Trusted Platform Module/tpm-uefi-log/',
                component: ComponentCreator('/writing-samples/ita/Attestation Technologies/Trusted Platform Module/tpm-uefi-log/', '33b'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Command-line/cli-api-client-management/',
                component: ComponentCreator('/writing-samples/ita/Command-line/cli-api-client-management/', '9c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Command-line/cli-examples/',
                component: ComponentCreator('/writing-samples/ita/Command-line/cli-examples/', 'b53'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Command-line/cli-install/',
                component: ComponentCreator('/writing-samples/ita/Command-line/cli-install/', '75a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Command-line/cli-policy-commands/',
                component: ComponentCreator('/writing-samples/ita/Command-line/cli-policy-commands/', 'b8a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Command-line/cli-service-commands/',
                component: ComponentCreator('/writing-samples/ita/Command-line/cli-service-commands/', 'c21'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Command-line/cli-signed-policy-commands/',
                component: ComponentCreator('/writing-samples/ita/Command-line/cli-signed-policy-commands/', 'f36'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Command-line/cli-user-commands/',
                component: ComponentCreator('/writing-samples/ita/Command-line/cli-user-commands/', 'fd7'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Concepts/concept-attestation-overview/',
                component: ComponentCreator('/writing-samples/ita/Concepts/concept-attestation-overview/', '6e2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Concepts/concept-attestation-tokens/',
                component: ComponentCreator('/writing-samples/ita/Concepts/concept-attestation-tokens/', '1ed'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Concepts/concept-maa-adapter/',
                component: ComponentCreator('/writing-samples/ita/Concepts/concept-maa-adapter/', 'ee0'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Concepts/concept-patterns/',
                component: ComponentCreator('/writing-samples/ita/Concepts/concept-patterns/', 'dbc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Concepts/concept-platform-tcb/',
                component: ComponentCreator('/writing-samples/ita/Concepts/concept-platform-tcb/', '932'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Concepts/concept-policies/',
                component: ComponentCreator('/writing-samples/ita/Concepts/concept-policies/', '031'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Concepts/concept-policy-v2/',
                component: ComponentCreator('/writing-samples/ita/Concepts/concept-policy-v2/', 'b99'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Concepts/concept-td-integrity/',
                component: ComponentCreator('/writing-samples/ita/Concepts/concept-td-integrity/', '906'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Concepts/concept-trusted-boot/',
                component: ComponentCreator('/writing-samples/ita/Concepts/concept-trusted-boot/', '68f'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Concepts/concept-user-roles-and-api-keys/',
                component: ComponentCreator('/writing-samples/ita/Concepts/concept-user-roles-and-api-keys/', '243'),
                exact: true
              },
              {
                path: '/writing-samples/ita/glossary/',
                component: ComponentCreator('/writing-samples/ita/glossary/', 'c1d'),
                exact: true
              },
              {
                path: '/writing-samples/ita/How-to workflows/howto-author-custom-policy/',
                component: ComponentCreator('/writing-samples/ita/How-to workflows/howto-author-custom-policy/', '101'),
                exact: true
              },
              {
                path: '/writing-samples/ita/How-to workflows/howto-manage-attestation-policies/',
                component: ComponentCreator('/writing-samples/ita/How-to workflows/howto-manage-attestation-policies/', '7cf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/How-to workflows/howto-manage-tags/',
                component: ComponentCreator('/writing-samples/ita/How-to workflows/howto-manage-tags/', 'c68'),
                exact: true
              },
              {
                path: '/writing-samples/ita/How-to workflows/howto-manage-users/',
                component: ComponentCreator('/writing-samples/ita/How-to workflows/howto-manage-users/', '5f7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/How-to workflows/howto-reports-metrics/',
                component: ComponentCreator('/writing-samples/ita/How-to workflows/howto-reports-metrics/', '6cc'),
                exact: true
              },
              {
                path: '/writing-samples/ita/How-to workflows/howto-SIEM-integration/',
                component: ComponentCreator('/writing-samples/ita/How-to workflows/howto-SIEM-integration/', '6c4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Integration/integrate-c-client/',
                component: ComponentCreator('/writing-samples/ita/Integration/integrate-c-client/', '018'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Integration/integrate-gcp-cs/',
                component: ComponentCreator('/writing-samples/ita/Integration/integrate-gcp-cs/', '235'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Integration/integrate-go-client/',
                component: ComponentCreator('/writing-samples/ita/Integration/integrate-go-client/', 'e09'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Integration/integrate-go-tdx-cli/',
                component: ComponentCreator('/writing-samples/ita/Integration/integrate-go-tdx-cli/', '8e1'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Integration/integrate-go-tpm/',
                component: ComponentCreator('/writing-samples/ita/Integration/integrate-go-tpm/', '394'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Integration/integrate-gramine/',
                component: ComponentCreator('/writing-samples/ita/Integration/integrate-gramine/', 'e2e'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Integration/integrate-java-client/',
                component: ComponentCreator('/writing-samples/ita/Integration/integrate-java-client/', '223'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Integration/integrate-overview/',
                component: ComponentCreator('/writing-samples/ita/Integration/integrate-overview/', '12a'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Integration/integrate-python-client/',
                component: ComponentCreator('/writing-samples/ita/Integration/integrate-python-client/', '47c'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Integration/integrate-relying-party/',
                component: ComponentCreator('/writing-samples/ita/Integration/integrate-relying-party/', '4be'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Key-broker/kbs.key.creation.retrieval/',
                component: ComponentCreator('/writing-samples/ita/Key-broker/kbs.key.creation.retrieval/', '3c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Key-broker/key-broker-service-install/',
                component: ComponentCreator('/writing-samples/ita/Key-broker/key-broker-service-install/', 'fc0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Key-broker/key-broker-service-kms-install/',
                component: ComponentCreator('/writing-samples/ita/Key-broker/key-broker-service-kms-install/', '6c3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Key-broker/key-broker-service-user-management/',
                component: ComponentCreator('/writing-samples/ita/Key-broker/key-broker-service-user-management/', 'c3a'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Key-broker/key-broker-service/',
                component: ComponentCreator('/writing-samples/ita/Key-broker/key-broker-service/', 'ca7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Quickstart/howto-manage-subscriptions/',
                component: ComponentCreator('/writing-samples/ita/Quickstart/howto-manage-subscriptions/', '5c1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Quickstart/tutorial-api-key/',
                component: ComponentCreator('/writing-samples/ita/Quickstart/tutorial-api-key/', 'ad8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Restapi/restapi-attestation-v2/',
                component: ComponentCreator('/writing-samples/ita/Restapi/restapi-attestation-v2/', 'cfb'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Restapi/restapi-attestation/',
                component: ComponentCreator('/writing-samples/ita/Restapi/restapi-attestation/', 'dea'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Restapi/restapi-azure-attestation/',
                component: ComponentCreator('/writing-samples/ita/Restapi/restapi-azure-attestation/', '53f'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Restapi/restapi-client-management/',
                component: ComponentCreator('/writing-samples/ita/Restapi/restapi-client-management/', 'f35'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Restapi/restapi-faithful/',
                component: ComponentCreator('/writing-samples/ita/Restapi/restapi-faithful/', '17f'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Restapi/restapi-intro/',
                component: ComponentCreator('/writing-samples/ita/Restapi/restapi-intro/', 'aa1'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Restapi/restapi-policy-management/',
                component: ComponentCreator('/writing-samples/ita/Restapi/restapi-policy-management/', '8d7'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Restapi/restapi-product-management/',
                component: ComponentCreator('/writing-samples/ita/Restapi/restapi-product-management/', '9e5'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Restapi/restapi-service-management/',
                component: ComponentCreator('/writing-samples/ita/Restapi/restapi-service-management/', 'b22'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Restapi/restapi-service-offer-management/',
                component: ComponentCreator('/writing-samples/ita/Restapi/restapi-service-offer-management/', 'e07'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Restapi/restapi-tenant-management/',
                component: ComponentCreator('/writing-samples/ita/Restapi/restapi-tenant-management/', '42c'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-amd-azure-vm/',
                component: ComponentCreator('/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-amd-azure-vm/', '6a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-azure-vtpm/',
                component: ComponentCreator('/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-azure-vtpm/', 'e95'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-sevsnp-gcp/',
                component: ComponentCreator('/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-sevsnp-gcp/', '6f7'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-sgx/',
                component: ComponentCreator('/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-sgx/', '28a'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-tdx-gcp/',
                component: ComponentCreator('/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-tdx-gcp/', 'b72'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-tdx/',
                component: ComponentCreator('/writing-samples/ita/Tutorials and examples/Intel Trust Authority Client examples/tutorial-tdx/', 'd44'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Tutorials and examples/tutorial-cicd/',
                component: ComponentCreator('/writing-samples/ita/Tutorials and examples/tutorial-cicd/', '1c2'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Tutorials and examples/tutorial-tdx-workload/',
                component: ComponentCreator('/writing-samples/ita/Tutorials and examples/tutorial-tdx-workload/', 'ce9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/ita/Utilites/utility-faithful-verifier/',
                component: ComponentCreator('/writing-samples/ita/Utilites/utility-faithful-verifier/', 'e7f'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Utilites/utility-policy-builder/',
                component: ComponentCreator('/writing-samples/ita/Utilites/utility-policy-builder/', '399'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Utilites/utility-policy-signing/',
                component: ComponentCreator('/writing-samples/ita/Utilites/utility-policy-signing/', 'c35'),
                exact: true
              },
              {
                path: '/writing-samples/ita/Utilites/whats-new/',
                component: ComponentCreator('/writing-samples/ita/Utilites/whats-new/', '1bb'),
                exact: true
              },
              {
                path: '/writing-samples/reference/identity-router-api/',
                component: ComponentCreator('/writing-samples/reference/identity-router-api/', 'a29'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/writing-samples/',
                component: ComponentCreator('/writing-samples/', '119'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
