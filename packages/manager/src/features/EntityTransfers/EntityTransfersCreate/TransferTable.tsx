import * as React from 'react';
import CheckBox from 'src/components/CheckBox';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { TableBody } from 'src/components/TableBody';
import { TableHead } from 'src/components/TableHead';
import Typography from 'src/components/core/Typography';
import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
import { PaginationFooter } from 'src/components/PaginationFooter/PaginationFooter';
import { Table } from 'src/components/Table';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';

const useStyles = makeStyles((theme: Theme) => ({
  check: {
    '& svg': {
      height: 20,
      width: 20,
    },
  },
  checkEmpty: {
    '& svg': { color: '#cccccc' },
  },
  footer: {
    marginBottom: theme.spacing(),
    padding: theme.spacing(),
  },
  root: {
    marginBottom: theme.spacing(),
    marginTop: theme.spacing(2),
  },
  search: {
    marginBottom: theme.spacing(0.5),
    maxWidth: 556,
  },
  table: {
    '& thead': {
      '& th': {
        '&:first-of-type': {
          borderLeft: 'none',
          paddingLeft: 0,
          paddingRight: 0,
        },
        '&:last-of-type': {
          borderRight: 'none',
        },
        backgroundColor: theme.bg.tableHeader,
        borderBottom: `2px solid ${theme.borderColors.borderTable}`,
        borderLeft: `1px solid ${theme.borderColors.borderTable}`,
        borderRight: `1px solid ${theme.borderColors.borderTable}`,
        borderTop: `2px solid ${theme.borderColors.borderTable}`,
        color: theme.textColors.tableHeader,
        fontFamily: theme.font.bold,
        fontSize: '0.875em !important',
        padding: '0px 15px',
      },
    },
    marginTop: theme.spacing(),
  },
}));

export interface Props {
  count: number;
  page: number;
  pageSize: number;
  headers: string[];
  hasSelectedAll: boolean;
  requestPage: (page: number) => void;
  handleSearch: (searchText: string) => void;
  toggleSelectAll: (isToggled: boolean) => void;
  children: JSX.Element;
}

export const TransferTable: React.FC<Props> = (props) => {
  const {
    count,
    handleSearch,
    hasSelectedAll,
    headers,
    page,
    pageSize,
    requestPage,
    toggleSelectAll,
  } = props;
  const classes = useStyles();

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    return toggleSelectAll(e.target.checked);
  };

  return (
    <>
      <Typography variant="h2" className={classes.root}>
        Linodes
      </Typography>
      <DebouncedSearchTextField
        className={classes.search}
        placeholder="Search by label"
        debounceTime={400}
        onSearch={handleSearch}
        isSearching={false}
        label="Search by label"
        hideLabel
      />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell style={{ textAlign: 'center', width: 50 }}>
              <CheckBox
                className={`${classes.check} ${
                  hasSelectedAll ? '' : classes.checkEmpty
                }`}
                checked={hasSelectedAll}
                onChange={handleToggleAll}
                inputProps={{
                  'aria-label': `Select all services on page`,
                }}
              />
            </TableCell>
            {headers.map((thisHeader) => (
              <TableCell key={`entity-table-header-${thisHeader}`}>
                {thisHeader}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{props.children}</TableBody>
      </Table>
      {count > pageSize ? (
        <PaginationFooter
          count={count}
          handlePageChange={requestPage}
          handleSizeChange={() => null} // Transfer tables are going to be sticky at 25
          page={page}
          pageSize={pageSize}
          eventCategory="Service Transfer Table"
          fixedSize
        />
      ) : null}
    </>
  );
};

export default React.memo(TransferTable);
