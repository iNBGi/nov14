import React, { useEffect, useState, useRef } from 'react';
import HumanPose from 'react-native-human-pose';
import { View, Text, Button } from 'react-native';
import { WelcomeToLungeSensor } from './lungefront';
import { useIsFocused, useNavigation } from '@react-navigation/native';

export const Lungesensor = () => {
  const [showWelcomePage, setShowWelcomePage] = useState(true);
  const [noOfLunges, setNoOfLunges] = useState(0);
  const [isLunging, setIsLunging] = useState(false);
  const [holdingLunge, setHoldingLunge] = useState(false);
  const [status, setStatus] = useState('unknown');
  const [hasAnnouncedKeypoints, setHasAnnouncedKeypoints] = useState(false);
  const [currentPose, setCurrentPose] = useState(null);
  const [lungeLimit, setLungeLimit] = useState(null);
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [keypointsVisible, setKeypointsVisible] = useState(true);
  const [startMessageVisible, setStartMessageVisible] = useState(false);
  const [improperStatusVisible, setImproperStatusVisible] = useState(false);
  const [showLungeCount, setShowLungeCount] = useState(true); // New state for toggling
  const [recentlyCounted, setRecentlyCounted] = useState(false); // New flag for recent count

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const ttsTimeoutRef = useRef(null);
  const holdStartTimeRef = useRef(0);
  const lastLungeTimeRef = useRef(0);
  const holdTime = 1000; // Time to hold the lunge
  const cooldownTime = 1000; // Cooldown time between lunges

  const minConfidence = 0.5; // Pose detection confidence threshold
  const verticalThreshold = 300; // Vertical distance threshold for proper lunge detection

  const checkKeypointsConfidence = (pose) => {
    const { leftHip, leftKnee, leftAnkle, rightHip, rightKnee, rightAnkle } = pose[0]?.pose;
    return (
      leftHip?.confidence > minConfidence &&
      leftKnee?.confidence > minConfidence &&
      leftAnkle?.confidence > minConfidence &&
      rightHip?.confidence > minConfidence &&
      rightKnee?.confidence > minConfidence &&
      rightAnkle?.confidence > minConfidence
    );
  };

  const onPoseDetected = (pose) => {
    if (!isFocused) return; // Prevent updates if not focused
    if (noOfLunges >= lungeLimit) return; // Stop further actions when lunge limit is reached

    setCurrentPose(pose);
    const keypointsAreVisible = checkKeypointsConfidence(pose);
    setKeypointsVisible(keypointsAreVisible);

    if (keypointsAreVisible) {
      const { leftHip, leftKnee, leftAnkle, rightHip, rightKnee, rightAnkle } = pose[0]?.pose;
      const verticalDistanceLeft = Math.abs(leftHip.y - leftAnkle.y);
      const verticalDistanceRight = Math.abs(rightHip.y - rightAnkle.y);

      if (verticalDistanceLeft < verticalThreshold && verticalDistanceRight < verticalThreshold) {
        if (!isLunging) {
          setIsLunging(true);
          holdStartTimeRef.current = Date.now();
        } else {
          const holdDuration = Date.now() - holdStartTimeRef.current;
          if (holdDuration >= holdTime && !holdingLunge) {
            setHoldingLunge(true);
            const currentTime = Date.now();
            if (currentTime - lastLungeTimeRef.current > cooldownTime) {
              setNoOfLunges((prevNoOfLunges) => {
                const newNoOfLunges = prevNoOfLunges + 1;
                if (newNoOfLunges >= lungeLimit) {
                  clearInterval(ttsTimeoutRef.current);
                }
                setStatus('proper');
                setRecentlyCounted(true);
                setTimeout(() => {
                  if (newNoOfLunges < lungeLimit) {
                    setRecentlyCounted(false);
                    setStatus('unknown');
                  }
                }, 2000);
                return newNoOfLunges;
              });
              lastLungeTimeRef.current = currentTime;
            }            
          }
        }
      } else {
        if (isLunging && !recentlyCounted) { // Check recently counted flag
          setIsLunging(false);
          setHoldingLunge(false);
          setStatus('improper');
          setImproperStatusVisible(true);
          setTimeout(() => {
            setImproperStatusVisible(false);
            setStatus('unknown');
          }, 2000);
        } else {
          setStatus('unknown');
        }
      }

      if (!hasAnnouncedKeypoints && noOfLunges === 0) {
        setHasAnnouncedKeypoints(true);
        setStartMessageVisible(true);
        setTimeout(() => setStartMessageVisible(false), 3000);
      }
    } else {
      setIsLunging(false);
      setHoldingLunge(false);
      setStatus('unknown');
      if (hasAnnouncedKeypoints) {
        setHasAnnouncedKeypoints(false);
      }
    }
  };

  const onStart = (level) => {
    setShowWelcomePage(false);
    setCurrentLevel(level);
    switch (level) {
      case 'beginner':
        setLungeLimit(5);
        break;
      case 'intermediate':
        setLungeLimit(15);
        break;
      case 'experienced':
        setLungeLimit(20);
        break;
      default:
        setLungeLimit(5);
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
    setNoOfLunges(0);
    setIsLunging(false);
    setHoldingLunge(false);
    setStatus('unknown');
    setHasAnnouncedKeypoints(false);
    setCurrentPose(null);
    setKeypointsVisible(true);
    setStartMessageVisible(false);
    setImproperStatusVisible(false);
    holdStartTimeRef.current = 0;
    lastLungeTimeRef.current = 0;

    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
      ttsTimeoutRef.current = null;
    }
  };

  const resetApp = () => {
    setShowWelcomePage(true);
    setNoOfLunges(0);
    setIsLunging(false);
    setHoldingLunge(false);
    setStatus('unknown');
    setHasAnnouncedKeypoints(false);
    setCurrentPose(null);
    setLungeLimit(null);
    setKeypointsVisible(true);
    setStartMessageVisible(false);
    setImproperStatusVisible(false);
    holdStartTimeRef.current = 0;
    lastLungeTimeRef.current = 0;

    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
      ttsTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    let toggleInterval;
    if (noOfLunges >= lungeLimit) {
      toggleInterval = setInterval(() => {
        setShowLungeCount((prev) => !prev);
      }, 2000); // Change the interval as needed
    }
    return () => {
      if (toggleInterval) clearInterval(toggleInterval);
    };
  }, [noOfLunges, lungeLimit]);

  return (
    <View style={{ flex: 1 }}>
      {showWelcomePage ? (
        <WelcomeToLungeSensor onStart={onStart} />
      ) : (
        <>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 25,
              color:
                noOfLunges >= lungeLimit
                  ? 'green'
                  : startMessageVisible
                  ? 'green'
                  : status === 'proper'
                  ? 'green'
                  : 'red',
              fontWeight: 'bold',
              marginVertical: 20,
            }}>
            {noOfLunges >= lungeLimit
              ? 'You are now finished'
              : startMessageVisible
              ? 'You may start now'
              : keypointsVisible
              ? status === 'proper'
                ? 'Proper'
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
              color: noOfLunges >= lungeLimit ? 'green' : status === 'proper' ? 'green' : 'red',
            }}>
            {noOfLunges >= lungeLimit
              ? showLungeCount
                ? `No of Lunges: ${noOfLunges}`
                : `Current Level: ${currentLevel}`
              : `No of Lunges: ${noOfLunges}`}
          </Text>
          <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Button title="Next Level" onPress={proceedToNextLevel} disabled={noOfLunges < lungeLimit} />
            <Button title="Reset" onPress={resetApp} />
            <Button title="Go Back" onPress={() => navigation.goBack()} />
          </View>
        </>
      )}
    </View>
  );
};

export default Lungesensor;
