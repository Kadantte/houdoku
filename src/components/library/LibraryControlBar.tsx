/* eslint-disable react/jsx-boolean-value */
import React, { useState } from 'react';
import { Button, Slider, Input, Dropdown, Menu, Popover } from 'antd';
import { DownOutlined, SyncOutlined } from '@ant-design/icons';
import { Header } from 'antd/lib/layout/layout';
import { connect, ConnectedProps } from 'react-redux';
import { Series, SeriesStatus } from 'houdoku-extension-lib';
import styles from './LibraryControlBar.css';
import { setFilter } from '../../features/library/actions';
import { loadSeriesList, reloadSeriesList } from '../../features/library/utils';
import { setStatusText } from '../../features/statusbar/actions';
import { RootState } from '../../store';
import { LibrarySort, LibraryView, ProgressFilter } from '../../models/types';
import {
  setLibraryColumns,
  setLibraryViews,
  setLibraryFilterProgress,
  setLibraryFilterStatus,
  setLibrarySort,
} from '../../features/settings/actions';

const mapState = (state: RootState) => ({
  seriesList: state.library.seriesList,
  reloadingSeriesList: state.library.reloadingSeriesList,
  filter: state.library.filter,
  libraryFilterStatus: state.settings.libraryFilterStatus,
  libraryFilterProgress: state.settings.libraryFilterProgress,
  libraryColumns: state.settings.libraryColumns,
  libraryViews: state.settings.libraryViews,
  librarySort: state.settings.librarySort,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDispatch = (dispatch: any) => ({
  setStatusText: (text?: string) => dispatch(setStatusText(text)),
  loadSeriesList: () => loadSeriesList(dispatch),
  reloadSeriesList: (seriesList: Series[], callback?: () => void) =>
    reloadSeriesList(dispatch, seriesList, callback),
  setFilter: (filter: string) => dispatch(setFilter(filter)),
  setLibraryFilterStatus: (status: SeriesStatus | null) =>
    dispatch(setLibraryFilterStatus(status)),
  setLibraryFilterProgress: (progressFilter: ProgressFilter) =>
    dispatch(setLibraryFilterProgress(progressFilter)),
  setLibraryColumns: (libraryColumns: number) =>
    dispatch(setLibraryColumns(libraryColumns)),
  setLibraryViews: (libraryViews: LibraryView) =>
    dispatch(setLibraryViews(libraryViews)),
  setLibrarySort: (librarySort: LibrarySort) =>
    dispatch(setLibrarySort(librarySort)),
});

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = PropsFromRedux & {};

const LibraryControlBar: React.FC<Props> = (props: Props) => {
  const [showingColumnsPopover, setShowingColumnsPopover] = useState(false);

  /**
   * Get a displayable string for the current filterStatus value.
   * @returns a user-friendly representation of the filterStatus prop
   */
  const getFilterStatusText = () => {
    const status = props.libraryFilterStatus;

    let valueText = '';
    if (status === null) valueText = 'Any';
    else valueText = status;
    return `Status: ${valueText}`;
  };

  /**
   * Get a displayable string for the current filterProgress value.
   * @returns a user-friendly representation of the filterProgress prop
   */
  const getFilterProgressText = () => {
    const prefix = 'Progress: ';

    if (props.libraryFilterProgress === ProgressFilter.All)
      return `${prefix}All`;
    if (props.libraryFilterProgress === ProgressFilter.Unread)
      return `${prefix}Unread`;
    if (props.libraryFilterProgress === ProgressFilter.Finished)
      return `${prefix}Finished`;
    return prefix;
  };

  /**
   * Get a displayable string for the current libraryView value.
   * @returns a user-friendly representation of the libraryView prop
   */
  const getLibraryView = () => {
    const prefix = 'View: ';

    if (props.libraryViews === LibraryView.Grid) return `${prefix}Grid`;
    if (props.libraryViews === LibraryView.List) return `${prefix}List`;
    return prefix;
  };

  /**
   * Get a displayable string for the current librarySort value.
   * @returns a user-friendly representation of the librarySort prop
   */
  const getLibrarySortText = () => {
    const prefix = 'Sort: ';

    if (props.librarySort === LibrarySort.TitleAsc) return `${prefix}Title Asc`;
    if (props.librarySort === LibrarySort.TitleDesc)
      return `${prefix}Title Desc`;
    if (props.librarySort === LibrarySort.UnreadAsc)
      return `${prefix}Unread Asc`;
    if (props.librarySort === LibrarySort.UnreadDesc)
      return `${prefix}Unread Desc`;
    return prefix;
  };

  return (
    <>
      <Header className={styles.header}>
        <Button
          className={styles.reloadButton}
          type="primary"
          onClick={() => {
            if (!props.reloadingSeriesList) {
              props.reloadSeriesList(props.seriesList, props.loadSeriesList);
            }
          }}
        >
          {props.reloadingSeriesList ? <SyncOutlined spin /> : 'Refresh'}
        </Button>
        <Popover
          content={
            <Slider
              min={2}
              max={8}
              step={2}
              value={props.libraryColumns}
              onChange={(value: number) => props.setLibraryColumns(value)}
            />
          }
          title="Change number of columns"
          trigger="click"
          visible={showingColumnsPopover}
          onVisibleChange={(visible: boolean) =>
            setShowingColumnsPopover(visible)
          }
        >
          <Button className={styles.columnsButton}>Columns</Button>
        </Popover>
        <Dropdown
          className={styles.progressDropdown}
          overlay={
            <Menu
              onClick={(e: any) =>
                props.setLibraryFilterProgress(e.item.props['data-value'])
              }
            >
              <Menu.Item
                key={ProgressFilter.All}
                data-value={ProgressFilter.All}
              >
                All
              </Menu.Item>
              <Menu.Item
                key={ProgressFilter.Unread}
                data-value={ProgressFilter.Unread}
              >
                Unread
              </Menu.Item>
              <Menu.Item
                key={ProgressFilter.Finished}
                data-value={ProgressFilter.Finished}
              >
                Finished
              </Menu.Item>
            </Menu>
          }
        >
          <Button>
            {getFilterProgressText()} <DownOutlined />
          </Button>
        </Dropdown>
        <Dropdown
          className={styles.libraryViewDropdown}
          overlay={
            <Menu
              onClick={(e: any) =>
                props.setLibraryViews(e.item.props['data-value'])
              }
            >
              <Menu.Item key={LibraryView.Grid} data-value={LibraryView.Grid}>
                Grid
              </Menu.Item>
              <Menu.Item key={LibraryView.List} data-value={LibraryView.List}>
                List
              </Menu.Item>
            </Menu>
          }
        >
          <Button>
            {getLibraryView()} <DownOutlined />
          </Button>
        </Dropdown>
        <Dropdown
          className={styles.libraryViewDropdown}
          overlay={
            <Menu
              onClick={(e: any) =>
                props.setLibrarySort(e.item.props['data-value'])
              }
            >
              <Menu.Item
                key={LibrarySort.TitleAsc}
                data-value={LibrarySort.TitleAsc}
              >
                Title Asc
              </Menu.Item>
              <Menu.Item
                key={LibrarySort.TitleDesc}
                data-value={LibrarySort.TitleDesc}
              >
                Title Desc
              </Menu.Item>
              <Menu.Item
                key={LibrarySort.UnreadDesc}
                data-value={LibrarySort.UnreadDesc}
              >
                Unread Desc
              </Menu.Item>
              <Menu.Item
                key={LibrarySort.UnreadAsc}
                data-value={LibrarySort.UnreadAsc}
              >
                Unread Asc
              </Menu.Item>
            </Menu>
          }
        >
          <Button>
            {getLibrarySortText()} <DownOutlined />
          </Button>
        </Dropdown>
        <Dropdown
          className={styles.statusDropdown}
          overlay={
            <Menu
              onClick={(e: any) =>
                props.setLibraryFilterStatus(e.item.props['data-value'])
              }
            >
              <Menu.Item key={null} data-value={null}>
                Any
              </Menu.Item>
              <Menu.Item
                key={SeriesStatus.ONGOING}
                data-value={SeriesStatus.ONGOING}
              >
                Ongoing
              </Menu.Item>
              <Menu.Item
                key={SeriesStatus.COMPLETED}
                data-value={SeriesStatus.COMPLETED}
              >
                Completed
              </Menu.Item>
              <Menu.Item
                key={SeriesStatus.CANCELLED}
                data-value={SeriesStatus.CANCELLED}
              >
                Cancelled
              </Menu.Item>
            </Menu>
          }
        >
          <Button>
            {getFilterStatusText()} <DownOutlined />
          </Button>
        </Dropdown>
        <Input
          className={styles.seriesFilter}
          placeholder="Filter series list..."
          onChange={(e) => props.setFilter(e.target.value)}
        />
      </Header>
    </>
  );
};

export default connector(LibraryControlBar);
