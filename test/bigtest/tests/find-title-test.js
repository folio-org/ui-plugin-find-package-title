import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { Pluggable } from '@folio/stripes/core';

import setupApplication, { mount } from '../helpers/helpers';
import PluginInteractor from '../interactors/plugin';
import {
  selectedTitles,
  notSelectedTitles,
} from '../constants';

const onRecordChosenHandler = sinon.spy();

describe('find title functionality', function () {
  beforeEach(() => { onRecordChosenHandler.resetHistory(); });
  const plugin = new PluginInteractor();
  setupApplication();

  const renderComponent = (props = {}) => {
    return mount(
      <Pluggable
        type="find-package-title"
        onRecordChosen={onRecordChosenHandler}
        {...props}
      />
    );
  };

  describe('when the plugin is open in the title search mode', function () {
    beforeEach(async function () {
      await renderComponent();
      await plugin.triggerButton.click();
      await plugin.modal.switchToTitleSearch();
    });

    it('should display the search index select', () => {
      expect(plugin.modal.searchIndexSelectDisplayed).to.be.true;
    });

    it('should focus the search field by default', () => {
      expect(plugin.modal.searchField.isFocused).to.be.true;
    });

    it('should disable the search button by default', () => {
      expect(plugin.modal.searchButton.isEnabled).to.be.false;
    });

    it('should disable the reset button by default', () => {
      expect(plugin.modal.resetButton.isEnabled).to.be.false;
    });

    it('should disable search by tags by default', () => {
      expect(plugin.modal.searchByTagsDisabled).to.be.true;
    });

    it('should disable search by access types by default', () => {
      expect(plugin.modal.searchByAccessTypesDisabled).to.be.true;
    });

    it('should ask the user to enter a search query', () => {
      expect(plugin.modal.searchPromptDisplayed).to.be.true;
    });

    describe('and a search query was entered', () => {
      beforeEach(async () => {
        await plugin.modal.searchField.fill('selected');
      });

      it('should enable the search button', () => {
        expect(plugin.modal.searchButton.isEnabled).to.be.true;
      });

      it('should enable the reset button', () => {
        expect(plugin.modal.resetButton.isEnabled).to.be.true;
      });

      describe('and search by index was performed', () => {
        beforeEach(async () => {
          await plugin.modal.searchIndexSelect.selectOption('Subject');
          await plugin.modal.searchButton.click();
        });

        it('should display titles found by subject index', () => {
          expect(plugin.modal.resultsList.rows().length).to.equal(1);
          expect(plugin.modal.resultsList.rows(0).cells(1).content).to.equal('Found by subject');
        });

        describe('and search type was switched to packages and package search was done', () => {
          beforeEach(async () => {
            await plugin.modal.switchToPackageSearch();
            await plugin.modal.toggleSearchByTags();
            await plugin.modal.tagsFilterSelect.clickOption(1);
          });

          it('should display correct package search results', () => {
            expect(plugin.modal.resultsList.rows().length).to.equal(1);
            expect(plugin.modal.resultsList.rows(0).cells(1).content).to.equal('Tagged package');
          });

          describe('and search type was switched back to titles', () => {
            beforeEach(async () => {
              await plugin.modal.switchToTitleSearch();
            });

            it('should retain previous title search results', () => {
              expect(plugin.modal.resultsList.rows().length).to.equal(1);
              expect(plugin.modal.resultsList.rows(0).cells(1).content).to.equal('Found by subject');
            });

            describe('and search type was switched to packages', () => {
              beforeEach(async () => {
                await plugin.modal.switchToPackageSearch();
              });

              it('should retain previous package search results', () => {
                expect(plugin.modal.resultsList.rows().length).to.equal(1);
                expect(plugin.modal.resultsList.rows(0).cells(1).content).to.equal('Tagged package');
              });
            });
          });
        });
      });

      describe('and searching by tags was enabled', () => {
        beforeEach(async () => {
          await plugin.modal.toggleSearchByTags();
        });

        it('should enable searching by tags', () => {
          expect(plugin.modal.searchByTagsDisabled).to.be.false;
        });

        it('should disable search field', () => {
          expect(plugin.modal.searchField.isEnabled).to.be.false;
        });

        it('should disable search button', () => {
          expect(plugin.modal.searchButton.isEnabled).to.be.false;
        });

        describe('and a tag was selected', () => {
          beforeEach(async () => {
            await plugin.modal.tagsFilterSelect.clickOption(1);
          });

          it('should display only tagged titles', () => {
            expect(plugin.modal.resultsList.rows().length).to.equal(1);
            expect(plugin.modal.resultsList.rows(0).cells(1).content).to.equal('Tagged title');
          });
        });
      });

      describe('and searching by access types was enabled', () => {
        beforeEach(async () => {
          await plugin.modal.toggleSearchByAccessTypes();
        });

        it('should enable searching by tags', () => {
          expect(plugin.modal.searchByAccessTypesDisabled).to.be.false;
        });

        it('should disable search field', () => {
          expect(plugin.modal.searchField.isEnabled).to.be.false;
        });

        it('should disable search button', () => {
          expect(plugin.modal.searchButton.isEnabled).to.be.false;
        });

        describe('and an access type was selected', () => {
          beforeEach(async () => {
            await plugin.modal.accessTypesFilterSelect.clickOption(1);
          });

          it('should display only titles with access types', () => {
            expect(plugin.modal.resultsList.rows().length).to.equal(1);
            expect(plugin.modal.resultsList.rows(0).cells(1).content).to.equal('Has access type');
          });
        });
      });

      describe('and submit button was clicked', () => {
        beforeEach(async () => {
          await plugin.modal.searchButton.click();
        });

        it('should display a list of loaded titles', () => {
          expect(plugin.modal.resultsList.rows().length).to.equal(6);
        });

        describe('and reset button was clicked', () => {
          beforeEach(async () => {
            await plugin.modal.resetButton.click();
          });

          it('should reset the search field to the initial value', () => {
            expect(plugin.modal.searchField.value).to.equal('');
          });

          it('should ask the user to enter a search query', () => {
            expect(plugin.modal.searchPromptDisplayed).to.be.true;
          });
        });

        describe('and search for not selected titles were done', () => {
          beforeEach(async () => {
            await plugin.modal.clickNotSelectedFilter();
            await plugin.modal.searchField.fill('some title');
            await plugin.modal.searchButton.click();
          });

          it('should display only not selected titles', () => {
            expect(plugin.modal.resultsList.rows().length).to.equal(1);
            expect(plugin.modal.resultsList.rows(0).cells(1).content).to.equal('Not selected');
          });

          describe('and a title was selected', () => {
            beforeEach(async () => {
              await plugin.modal.resultsList.rows(0).click();
            });

            it('should close the modal', () => {
              expect(plugin.modalIsDisplayed).to.be.false;
            });

            it('should call the provided callback with the data of the selected title', () => {
              const { attributes, id, type } = notSelectedTitles[0].included[0];

              expect(onRecordChosenHandler.calledOnceWith({
                id,
                type,
                ...attributes,
              })).to.be.true;
            });
          });
        });
      });
    });
  });

  describe('when the plugin is rendered with a multiselect prop', () => {
    beforeEach(async function () {
      await renderComponent({
        isMultiSelect: true,
      });
    });

    describe('and a trigger button is clicked', () => {
      beforeEach(async () => {
        await plugin.triggerButton.click();
        await plugin.modal.switchToTitleSearch();
      });

      it('should open the plugin modal', () => {
        expect(plugin.modalIsDisplayed).to.be.true;
      });

      describe('when searching for titles', () => {
        beforeEach(async () => {
          await plugin.modal.searchField.fill('Selected');
          await plugin.modal.clickSelectedFilter();
        });

        describe('and submit button was clicked', () => {
          beforeEach(async () => {
            await plugin.modal.searchButton.click();
          });

          it('should display a list of loaded titles', () => {
            expect(plugin.modal.resultsList.rows().length).to.equal(2);
          });

          describe('and a title was selected', () => {
            beforeEach(async () => {
              await plugin.modal.resultsList.rows(0).click();
            });

            it('should not close the modal', () => {
              expect(plugin.modalIsDisplayed).to.be.true;
            });

            it('should update titles selected count in the footer', () => {
              expect(plugin.modal.titlesSelectedText).to.equal('Titles selected: 1');
            });

            describe('and clicking Cancel', () => {
              beforeEach(async () => {
                await plugin.modal.cancelSelection();
              });

              it('should close the modal', () => {
                expect(plugin.modalIsDisplayed).to.be.false;
              });

              it('should not call the provided callback', () => {
                expect(onRecordChosenHandler.callCount).to.equal(0);
              });
            });

            describe('and selecting a second title', () => {
              beforeEach(async () => {
                await plugin.modal.resultsList.rows(1).click();
                await plugin.modal.saveSelection();
              });

              it('should close the modal', () => {
                expect(plugin.modalIsDisplayed).to.be.false;
              });

              it('should call the provided callback with correct data', () => {
                const expectedTitles = selectedTitles.reduce((allResources, currentTitle) => {
                  const titleResources = currentTitle.included;
                  const formattedTitleResources = titleResources.map(({ attributes, id, type }) => ({
                    ...attributes,
                    type,
                    id,
                  }));

                  return [
                    ...allResources,
                    ...formattedTitleResources,
                  ];
                }, []);

                expect(onRecordChosenHandler.calledOnceWith(expectedTitles)).to.be.true;
              });
            });
          });
        });
      });
    });
  });
});
