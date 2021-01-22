import {
  selectedPackages,
  notSelectedPackages,
  taggedPackages,
  withAccessTypesPackages,
  selectedTitles,
  notSelectedTitles,
  taggedTitles,
  withAccessStatusTitles,
  foundBySubjectTitles,
} from '../constants';

export default function config() {
  this.get('/eholdings/packages', (schema, request) => {
    const allPackages = [
      ...selectedPackages,
      ...notSelectedPackages,
      ...taggedPackages,
      ...withAccessTypesPackages,
    ];

    if (request.queryParams['filter[selected]']) {
      if (request.queryParams['filter[selected]'] === 'true') {
        return {
          data: selectedPackages,
          meta: {
            totalResults: selectedPackages.length,
          }
        };
      }

      if (request.queryParams['filter[selected]'] === 'false') {
        return {
          data: notSelectedPackages,
          meta: {
            totalResults: notSelectedPackages.length,
          }
        };
      }
    }

    if (request.queryParams['filter[tags]']) {
      return {
        data: taggedPackages,
        meta: {
          totalResults: taggedPackages.length
        }
      };
    }

    if (request.queryParams['filter[access-type]']) {
      return {
        data: withAccessTypesPackages,
        meta: {
          totalResults: withAccessTypesPackages.length
        }
      };
    }

    if (request.queryParams.q) {
      const filteredPackages = allPackages.filter(item => {
        return item.attributes.name.toLowerCase().includes(request.queryParams.q.toLowerCase());
      });
      return {
        data: filteredPackages,
        meta: {
          totalResults: filteredPackages.length,
        },
      };
    }

    return {
      data: allPackages,
      meta: {
        totalResults: notSelectedPackages.length
          + selectedPackages.length
          + taggedPackages.length
          + withAccessTypesPackages.length
      }
    };
  });

  this.get('/eholdings/access-types', () => ({
    data: [
      {
        id: '3b1527b0-6180-4e2c-9b5c-0444f07d1bcf',
        type: 'accessTypes',
        attributes: {
          name: 'access type 1',
          credentialsId: '7c45728b-844b-4d14-8276-f4f0b9c27b78'
        },
      },
      {
        id: '4124527b0-6180-4e2c-1j8d-l97107d1bcf',
        type: 'accessTypes',
        attributes: {
          name: 'access type 2',
          credentialsId: '7c45728b-844b-4d14-8276-f4f0b9c27b78'
        },
      },
    ]
  }));

  this.get('/tags', ({
    tags: [{
      id: 'd3c8b511-41e7-422e-a483-18778d0596e5',
      label: 'important',
    }, {
      id: 'c3799dc5-500b-44dd-8e17-2f2354cc43e3',
      label: 'urgent',
    }],
  }));


  this.get('/eholdings/titles', (schema, request) => {
    const allTitles = [
      ...selectedTitles,
      ...notSelectedTitles,
      ...taggedTitles,
      ...withAccessStatusTitles,
      ...foundBySubjectTitles,
    ];

    if (parseInt(request.queryParams.page, 10) >= 1) {
      return {
        data: [],
        meta: {
          totalResults: 0,
        },
      };
    }

    if (request.queryParams['filter[selected]']) {
      if (request.queryParams['filter[selected]'] === 'true') {
        return {
          data: selectedTitles,
          meta: {
            totalResults: selectedTitles.length,
          }
        };
      }

      if (request.queryParams['filter[selected]'] === 'false') {
        return {
          data: notSelectedTitles,
          meta: {
            totalResults: notSelectedTitles.length,
          }
        };
      }
    }

    if (request.queryParams['filter[tags]']) {
      return {
        data: taggedTitles,
        meta: {
          totalResults: taggedTitles.length
        }
      };
    }

    if (request.queryParams['filter[access-type]']) {
      return {
        data: withAccessStatusTitles,
        meta: {
          totalResults: withAccessStatusTitles.length
        }
      };
    }

    if (request.queryParams['filter[name]']) {
      const filteredTitles = allTitles.filter(item => {
        return item.attributes.name.toLowerCase().includes(request.queryParams['filter[name]'].toLowerCase());
      });
      return {
        data: filteredTitles,
        meta: {
          totalResults: filteredTitles.length,
        },
      };
    }

    if (request.queryParams.searchfield === 'subject') {
      return {
        data: foundBySubjectTitles,
        meta: {
          totalResults: foundBySubjectTitles.length
        }
      };
    }

    return {
      data: allTitles,
      meta: {
        totalResults: notSelectedTitles.length
          + selectedTitles.length
          + taggedTitles.length
          + withAccessStatusTitles.length
          + foundBySubjectTitles.length
      }
    };
  });
}
