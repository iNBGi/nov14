import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import HumanPose from 'react-native-human-pose';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { WelcomeToDumbellSensor } from './dumbellfront';

export const Dumbellsensor = () => {
  const [showWelcomePage, setShowWelcomePage] = useState(true);
  const [noOfCurls, setNoOfCurls] = useState(0);
  const [isCurling, setIsCurling] = useState(false);
  const [holdingCurl, setHoldingCurl] = useState(false);
  const [status, setStatus] = useState('unknown');
  const [intervalId, setIntervalId] = useState(null);
  const [keypointIntervalId, setKeypointIntervalId] = useState(null);
  const [currentPose, setCurrentPose] = useState(null);
  const [curlLimit, setCurlLimit] = useState(null);
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [keypointsVisible, setKeypointsVisible] = useState(true);
  const [startMessageVisible, setStartMessageVisible] = useState(false);
  const [improperStatusVisible, setImproperStatusVisible] = useState(false);
  const [showCurlCount, setShowCurlCount] = useState(true); // New state for toggling

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const holdStartTimeRef = useRef(0);
  const lastCurlTimeRef = useRef(0);
  const holdTime = 1000;
  const cooldownTime = 1000;

  const calculateAngle = (joint1, joint2, joint3) => {
    const radians = Math.atan2(joint3.y - joint2.y, joint3.x - joint2.x) - Math.atan2(joint1.y - joint2.y, joint1.x - joint2.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180) {
      angle = 360 - angle;
    }
    return angle;
  };

  const checkKeypointsConfidence = (pose) => {
    const leftShoulder = pose[0]?.pose?.leftShoulder;
    const leftElbow = pose[0]?.pose?.leftElbow;
    const leftWrist = pose[0]?.pose?.leftWrist;
    const rightShoulder = pose[0]?.pose?.rightShoulder;
    const rightElbow = pose[0]?.pose?.rightElbow;
    const rightWrist = pose[0]?.pose?.rightWrist;

    const minConfidence = 0.7;

    return (
      leftShoulder?.confidence > minConfidence &&
      leftElbow?.confidence > minConfidence &&
      leftWrist?.confidence > minConfidence &&
      rightShoulder?.confidence > minConfidence &&
      rightElbow?.confidence > minConfidence &&
      rightWrist?.confidence > minConfidence
    );
  };

  const onPoseDetected = (pose) => {
    if (!isFocused || noOfCurls >= curlLimit) return;

    setCurrentPose(pose);

    const keypointsAreVisible = checkKeypointsConfidence(pose);
    setKeypointsVisible(keypointsAreVisible);

    if (keypointsAreVisible) {
      const leftShoulder = pose[0]?.pose?.leftShoulder;
      const leftElbow = pose[0]?.pose?.leftElbow;
      const leftWrist = pose[0]?.pose?.leftWrist;
      const rightShoulder = pose[0]?.pose?.rightShoulder;
      const rightElbow = pose[0]?.pose?.rightElbow;
      const rightWrist = pose[0]?.pose?.rightWrist;

      const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

      if (leftElbowAngle < 40 || rightElbowAngle < 40) {
        if (!isCurling) {
          setIsCurling(true);
          holdStartTimeRef.current = Date.now();
        } else {
          const holdDuration = Date.now() - holdStartTimeRef.current;
          if (holdDuration >= holdTime && !holdingCurl) {
            setHoldingCurl(true);
            const currentTime = Date.now();
            if (currentTime - lastCurlTimeRef.current > cooldownTime) {
              setNoOfCurls((prevNoOfCurls) => {
                const newNoOfCurls = prevNoOfCurls + 1;
                if (newNoOfCurls >= curlLimit) {
                  clearInterval(intervalId);
                  clearInterval(keypointIntervalId);
                }
                setStatus('proper');
                return newNoOfCurls;
              });
              lastCurlTimeRef.current = currentTime;
            }
          }
        }
      } else {
        if (isCurling) {
          setIsCurling(false);
          setHoldingCurl(false);
          if (status !== 'proper') {
            setTimeout(() => {
              setStatus('improper');
              setImproperStatusVisible(true);
              setTimeout(() => {
                setImproperStatusVisible(false);
                setStatus('unknown');
              }, 2000);
            }, 500);
          }
        } else {
          setStatus('unknown');
        }
      }
    } else {
      setIsCurling(false);
      setHoldingCurl(false);
      setStatus('unknown');
    }
  };

  const onStart = (level) => {
    setShowWelcomePage(false);
    setCurrentLevel(level);
    switch (level) {
      case 'beginner':
        setCurlLimit(5);
        break;
      case 'intermediate':
        setCurlLimit(15);
        break;
      case 'experienced':
        setCurlLimit(20);
        break;
      default:
        setCurlLimit(5);
    }
  };

  const proceedToNextLevel = () => {
    let nextLevel;
    switch (currentLevel) {
      case 'beginner':
        nextLevel = 'intermediate';
        break;
      case 'intermediate':
        nextLevel = 'experienced';
        break;
      default:
        return;
    }
    onStart(nextLevel);
    setNoOfCurls(0);
    setIsCurling(false);
    setHoldingCurl(false);
    setStatus('unknown');
    setCurrentPose(null);
    setKeypointsVisible(true);
    setStartMessageVisible(false);
    setImproperStatusVisible(false);
    holdStartTimeRef.current = 0;
    lastCurlTimeRef.current = 0;

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    if (keypointIntervalId) {
      clearInterval(keypointIntervalId);
      setKeypointIntervalId(null);
    }
  };

  const resetApp = () => {
    setShowWelcomePage(true);
    setNoOfCurls(0);
    setIsCurling(false);
    setHoldingCurl(false);
    setStatus('unknown');
    setCurrentPose(null);
    setCurlLimit(null);
    setKeypointsVisible(true);
    setStartMessageVisible(false);
    setImproperStatusVisible(false);
    holdStartTimeRef.current = 0;
    lastCurlTimeRef.current = 0;

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    if (keypointIntervalId) {
      clearInterval(keypointIntervalId);
      setKeypointIntervalId(null);
    }
  };

  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }, [isFocused, noOfCurls, curlLimit]);

  useEffect(() => {
    if (!showWelcomePage) {
      const id = setInterval(() => {
        if (currentPose && checkKeypointsConfidence(currentPose)) {
          setStatus('proper');
        } else {
          setStatus('improper');
        }
      }, 3000);

      setKeypointIntervalId(id);

      return () => {
        if (id) {
          clearInterval(id);
        }
      };
    }
  }, [showWelcomePage, currentPose]);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (keypointIntervalId) clearInterval(keypointIntervalId);
    };
  }, []);

  useEffect(() => {
    let toggleInterval;
    if (noOfCurls >= curlLimit) {
      toggleInterval = setInterval(() => {
        setShowCurlCount((prev) => !prev);
      }, 2000); // Change the interval as needed
    }
    return () => {
      if (toggleInterval) clearInterval(toggleInterval);
    };
  }, [noOfCurls, curlLimit]);

  return (
    <View style={{ flex: 1 }}>
      {showWelcomePage ? (
        <WelcomeToDumbellSensor onStart={onStart} />
      ) : (
        <>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 25,
              color:
                startMessageVisible
                  ? 'green'
                  : status === 'proper'
                  ? 'green'
                  : 'red',
              fontWeight: 'bold',
              marginVertical: 20,
            }}>
            {noOfCurls >= curlLimit
              ? 'You are now finished'
              : startMessageVisible
              ? 'You may start now'
              : keypointsVisible
              ? status === 'proper'
                ? 'Proper'
                : improperStatusVisible
                ? 'Improper'
                : ''
              : 'Move back and center yourself'}
          </Text>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <HumanPose
              height={500}
              width={400}
              enableKeyPoints={true}
              enableSkeleton={true}
              flipHorizontal={false}
              isBackCamera={false}
              color={'0, 255, 0'}
              mode={'single'}
              onPoseDetected={onPoseDetected}
            />
          </View>
          <Text
            style={{
              position: 'absolute',
              bottom: 50,
              left: 0,
              right: 0,
              textAlign: 'center',
              textShadowColor: 'black',
              backgroundColor: 'white',
              padding: 10,
              fontSize: 20,
              color: status === 'proper' ? 'green' : 'red',
            }}>
            {noOfCurls >= curlLimit ? showCurlCount ? `No of Curls: ${noOfCurls}` : `Current Level: ${currentLevel}` : `No of Curls: ${noOfCurls}`}
          </Text>
          <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Button title="Next Level" onPress={proceedToNextLevel} disabled={noOfCurls < curlLimit} />
            <Button title="Reset" onPress={resetApp} />
            <Button title="Go Back" onPress={() => navigation.goBack()} />
          </View>
        </>
      )}
    </View>
  );
};

export default Dumbellsensor;
