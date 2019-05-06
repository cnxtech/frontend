
import reducer, {initialState} from '../../redux/reducers';
import * as actions from '../../redux/actions';

const REDUCERS = {
  Navigate: {
    should: 'navigate to the step',
    expect: 'step',
    actions: {
      type: {
        constant: actions.NAVIGATE,
        data: {
          step: 'first-step'
        }
      },
      creator: {
        fn: actions.navigateTo,
        data: 'step-two'
      }
    }
  },
  Start: {
    should: 'update startedAt',
    expect: 'startedAt',
    actions: {
      type: {
        constant: actions.START,
        data: {
          value: 581923123
        }
      },
      creator: {
        fn: actions.start,
        data: 581923122
      },
    }
  },
  Location: {
    should: 'update location',
    expect: 'location',
    actions: {
      type: {
        constant: actions.UPDATE_LOCATION,
        data: {
          value: {
            address: 'hello',
            complement: 'darkness',
            addressData: 'my'
          }
        }
      },
      creator: {
        fn: actions.updateLocation,
        data: {
          address: 'old',
          complement: 'friend',
          addressData: '.'
        }
      }
    }
  },
  HomeDetails: {
    should: 'update home details',
    expect: 'homeDetails',
    actions: {
      type: {
        constant: actions.UPDATE_HOME_DETAILS,
        data: {
          value: {
            type: 1,
            area: 2,
            maintainceFree: true
          }
        }
      },
      creator: {
        fn: actions.updateHomeDetails,
        data: {
          type: 2,
          area: 3,
          maintainceFree: false
        }
      }
    }
  },
  Rooms: {
    should: 'update rooms',
    expect: 'rooms',
    actions: {
      type: {
        constant: actions.UPDATE_ROOMS,
        data: {
          value: {
            bedrooms: 1,
            suites: 2,
            bathrooms: 3,
            spots: 4,
            enterMoreBedrooms: true,
            enterMoreBathrooms: true,
            showSuites: true,
            showBathrooms: true,
            showSpots: true
          }
        }
      },
      creator: {
        fn: actions.updateRooms,
        data: {
          bedrooms: 4,
          suites: 3,
          bathrooms: 2,
          spots: 1,
          enterMoreBedrooms: false,
          enterMoreBathrooms: false,
          showSuites: false,
          showBathrooms: false,
          showSpots: false
        }
      }
    }
  },
  Phone: {
    should: 'update phone',
    expect: 'phone',
    actions: {
      type: {
        constant: actions.UPDATE_PHONE,
        data: {
          value: {
            localAreaCode: '13',
            number: '999999999',
            name: 'hello',
            id: '1234'
          }
        }
      },
      creator: {
        fn: actions.updatePhone,
        data: {
          localAreaCode: '11',
          number: '999999988',
          name: 'darkness',
          id: '4321'
        }
      }
    }
  },
  Pricing: {
    should: 'update pricing',
    expect: 'pricing',
    actions: {
      type: {
        constant: actions.UPDATE_PRICING,
        data: {
          value: {
            suggestedPrice: '123',
            userPrice: '333',
            editingPrice: '332'
          }
        }
      },
      creator: {
        fn: actions.updatePricing,
        data: {
          suggestedPrice: '321',
          userPrice: '222',
          editingPrice: '223'
        }
      }
    }
  },
  Services: {
    should: 'update services',
    expect: 'services',
    actions: {
      type: {
        constant: actions.UPDATE_SERVICES,
        data: {
          value: {
            wantsTour: true,
            tourOptions: '1234'
          }
        }
      },
      creator: {
        fn: actions.updateServices,
        data: {
          wantsTour: false,
          tourOptions: '4321'
        }
      }
    }
  },
  Tour: {
    should: 'update tour',
    expect: 'tour',
    actions: {
      type: {
        constant: actions.UPDATE_TOUR,
        data: {
          value: {
            month: 10,
            date: 31,
            time: 1283971231,
            timeRange: 2,
            monthOffset: 1,
            dayOffset: 3
          }
        }
      },
      creator: {
        fn: actions.updateTour,
        data: {
          month: 10,
          date: 30,
          time: 128397112341,
          timeRange: 1,
          monthOffset: 2,
          dayOffset: 4
        }
      }
    }
  },
  Listing: {
    should: 'update listing',
    expect: 'listing',
    actions: {
      type: {
        constant: actions.UPDATE_LISTING,
        data: {
          value: '123'
        }
      },
      creator: {
        fn: actions.updateListing,
        data: '321'
      }
    }
  }
};

const DEFAULT_STATE_DATA_KEY = 'value'

describe('Reducers', () => {
  it('should return initialState when no state and action provided', () => {
    expect(reducer(undefined, {})).toBe(initialState);
  });

  Object.keys(REDUCERS).forEach(eachReducer => {
    const {
      should,
      expect: expectedValue,
      actions: {
        type: {
          constant: action,
          data: typeData
        },
        creator: {
          fn: actionCreator,
          data: creatorData
        }
      }
    } = REDUCERS[eachReducer];

    describe(`${eachReducer} state`, () => {
      it(`should ${should} without using action creator`, () => {
        const newState = reducer(initialState, {
          type: action,
          ...typeData
        });

        const value = newState[expectedValue];
        const match = typeData[expectedValue] || typeData[DEFAULT_STATE_DATA_KEY];
        expect(value).toBe(match);
      });

      it(`should ${should} using action creator`, () => {
        const newState = reducer(initialState, actionCreator(creatorData));

        const value = newState[expectedValue];
        const match = creatorData;
        expect(value).toBe(match);
      });
    });
  });
});
