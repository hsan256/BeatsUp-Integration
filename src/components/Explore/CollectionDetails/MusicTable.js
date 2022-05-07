import PropTypes from 'prop-types';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './style.css';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  Table,
  Avatar,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  Typography,
  IconButton,
  TableContainer,
  Link,
  CircularProgress,
} from '@mui/material';
// _mock
import TextMaxLine from '../../TextMaxLine';
import Label from '../../Label';
import Iconify from '../../Iconify';
import Scrollbar from '../../Scrollbar';
import MusicPlayer from './MusicPlayer/MusicPlayer';
import { useWeb3 } from '../../../contexts/providers';

MusicTable.propTypes = {
  collection: PropTypes.object,
  locked: PropTypes.bool,
  collectionState: PropTypes.oneOf(['purchased', 'activated', 'deactivated']),
};

export default function MusicTable({ collection, locked, collectionState }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isLight = theme.palette.mode === 'light';
  const { isLoading } = useWeb3();

  return (
    <>
      <Card elevation={6}>
        <CardHeader title="Related Songs" sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="30%">Cover</TableCell>
                  <TableCell width="40%">Description</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collection.content.map((music) => (
                  <TableRow key={music._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            alt={music.title}
                            src={music.img}
                            sx={{ width: 48, height: 48, boxShadow: (theme) => theme.customShadows.z8 }}
                          />
                        </Box>
                        <Box sx={{ ml: 2 }}>
                          <TextMaxLine variant="body2" color="textSecondary" component="h2" line={1}>
                            {music.title}
                          </TextMaxLine>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <TextMaxLine variant="body2" color="textSecondary" component="h2" line={1}>
                        {music.desc}
                      </TextMaxLine>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">{format(new Date(music.createdAt), 'dd MMM yyyy')}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {format(new Date(music.createdAt), 'p')}
                      </Typography>
                    </TableCell>

                    {locked ? (
                      <TableCell>
                        <Label variant={isLight ? 'ghost' : 'filled'} color={'error'}>
                          {sentenceCase('Locked')}
                        </Label>
                      </TableCell>
                    ) : (
                      <TableCell>
                        <Label variant={isLight ? 'ghost' : 'filled'} color={'success'}>
                          {sentenceCase('Unlocked')}
                        </Label>
                      </TableCell>
                    )}

                    {isLoading ? (
                      <TableCell>
                        <CircularProgress thickness={2} />
                      </TableCell>
                    ) : locked ? (
                      <>
                        {collectionState === 'deactivated' && (
                          <TableCell>
                            <Typography variant="body2" color="inherit">
                              Get Access
                            </Typography>
                          </TableCell>
                        )}
                        {collectionState === 'purchased' && (
                          <TableCell>
                            <Typography variant="body2" color="inherit">
                              Waiting for activation...
                            </Typography>
                          </TableCell>
                        )}
                      </>
                    ) : (
                      <TableCell>
                        <AudioPlayer
                          className="player"
                          src={music.video}
                          showJumpControls={false}
                          layout="stacked"
                          customProgressBarSection={[]}
                          customControlsSection={['MAIN_CONTROLS']}
                          autoPlayAfterSrcChange={false}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <MusicPlayer collection={collection} locked={locked} />
        </Box>
      </Card>
    </>
  );
}
